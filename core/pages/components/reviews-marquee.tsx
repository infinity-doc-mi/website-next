import { cx } from '@infinitydoc/theme'
import { Star } from '@infinitydoc/icons'
import { Marquee } from './marquee.tsx'

const reviews = [
  {
    name: 'Jack',
    time: '2 months ago',
    body:
      'These guys are amazing! I was able to get an appointment the same day , and already had the right prescription sorted by the morning! Thank you so much for all the help both by the assistant and doctor! Amazing service, especially for tourists, or foreigners living in Italy!',
    img: 'https://avatar.vercel.sh/jack',
    rating: 5,
  },
  {
    name: 'Jill',
    time: '2 months ago',
    body:
      'Thanks Dr Medme for seeing us and providing great support, he even helped to call an ambulance to our hotel. The team is responsive to messages in WhatsApp. Whole experience is smooth with good follow up. Thanks again.',
    img: 'https://avatar.vercel.sh/jill',
    rating: 5,
  },
  {
    name: 'John',
    time: '2 months ago',
    body:
      'Could not recommend this doctor more. Dr. Hamid was able to visit me within 2 hours of requesting at my airbnb. He gave me a clear diagnosis with full explanation and a detailed explanation of treatment. I had a script and with the recommend treatment I was feeling dramatically better the next morning. They also were extremely communicative and provided all the documents needed for travel insurance to make claims easy! Great experience definitely pleased with the outcome.',
    img: 'https://avatar.vercel.sh/john',
    rating: 5,
  },
  {
    name: 'Jane',
    time: '2 months ago',
    body:
      'In the middle of my vacation,i had a pain in my ear and i made an appointment with Dr. Hamid. When I approached the clinic, I called the secretary, Ms. Sena, and she directed me to the right place.Dr hamid and Ms.Sena were very kind. The doctor spoke understandable English and solved my problem. Thanks to the doctor, the pain went away and I was able to continue my vacation. The whole team was very sweet and helpful, I highly recommend it.',
    img: 'https://avatar.vercel.sh/jane',
    rating: 5,
  },
  {
    name: 'Jenny',
    time: '2 months ago',
    body:
      'My mother suddenly  had rash after taking some pain medication, which we suspected from allergy to pain killer. We called for help for doctor visit at the hotel. We contacted doctor conveniently via WhatsApp. He quickly came to our hotel within less than an hour. Doctor is very nice. He informed us of all medications that he would prescribe. He gave us antihistamines and steroid injection for treating allergy. The next day mother is getting better!! We appreciate the service so much!',
    img: 'https://avatar.vercel.sh/jenny',
    rating: 5,
  },
  {
    name: 'James',
    time: '2 months ago',
    body:
      'The scheduling was easy, Dr. Abdel was extremely professional and took his time to make a full diagnosis, which was then followed up with a clear and extensive explanation of post-appointment treatments.',
    img: 'https://avatar.vercel.sh/james',
    rating: 5,
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = (ps: {
  img: string
  name: string
  time: string
  body: string
  rating: number
}) => {
  return (
    <figure
      className={cx(
        'relative w-80 h-52 cursor-pointer transition-colors overflow-hidden rounded-xl border border-border p-4 text-foreground text-clip',
        ' bg-surface',
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <img
          className='rounded-full'
          width='32'
          height='32'
          alt=''
          src={ps.img}
        />
        <div className='w-full flex justify-between'>
          <div className='flex flex-col'>
            <figcaption className='text-sm font-medium '>
              {ps.name}
            </figcaption>
            <div className='grid grid-cols-5 gap-1'>
              {Array.from({ length: ps.rating })
                .map((_, i) => (
                  <Star key={i} className='size-3 text-amber-400' />
                ))}
            </div>
          </div>
          <p className='text-xs font-medium text-primary/50'>{ps.time}</p>
        </div>
      </div>
      <blockquote className='mt-2 text-sm h-[70%] line-clamp-6'>
        {ps.body}
      </blockquote>
    </figure>
  )
}

export function ReviewsMarquee() {
  return (
    <div className='relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg'>
      <Marquee pauseOnHover className='[--duration:20s]'>
        {firstRow.map((review) => <ReviewCard key={review.name} {...review} />)}
      </Marquee>
      <Marquee reverse pauseOnHover className='[--duration:20s]'>
        {secondRow.map((review) => (
          <ReviewCard
            key={review.name}
            {...review}
          />
        ))}
      </Marquee>
      <div className='pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background'>
      </div>
      <div className='pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background'>
      </div>
    </div>
  )
}
