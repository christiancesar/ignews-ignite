import style from './styles.module.scss';

interface SubscripteButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscripteButtonProps) {
  return (
    <button
      type="button"
      className={style.subscribeButton}
    >
      Subscribe now
    </button>
  )
}