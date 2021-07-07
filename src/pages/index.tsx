import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image'
import avatar from '../../public/images/avatar.svg'
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import style from './home.module.scss';


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={style.contentContainer}>
        <section className={style.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span></h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <Image src={avatar} alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1JAbsWHbQUovpnsxjZwxSTrw", {
    expand: ["product"]
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('es-US', {
      style: 'currency', 
      currency: 'USD'
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24h
  }
}