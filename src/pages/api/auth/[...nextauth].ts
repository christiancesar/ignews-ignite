import { query as q, query } from 'faunadb';

import NextAuth from 'next-auth'
import { session } from 'next-auth/client';
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          query.Get(
            query.Intersection(
              [
                query.Match(
                  query.Index('subscription_by_user_ref'),
                  query.Select(
                    'ref',
                    query.Get(
                      query.Match(
                        query.Index('user_by_email'),
                        query.Casefold(session.user.email)
                      )
                    )
                  )
                ),
                query.Match(
                  query.Index('subscription_by_status'),
                  'active'
                )
              ]
            )
          )
        )
  
        return { 
          ...session, 
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;
      console.log(user)
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
  }
})