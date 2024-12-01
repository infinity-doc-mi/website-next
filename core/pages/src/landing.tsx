import {
  Calendar,
  DoctorOK,
  HandShake,
  InfinityDoctor,
  Lightbulb,
  Puzzle,
} from './assets.tsx'
import { ReviewsMarquee } from '../components/reviews-marquee.tsx'
import * as Icons from '@infinitydoc/icons'
import { GoogleRating } from '../components/google-rating.tsx'
import { ServiceHighlight } from '@infinitydoc/model'
import { type LoaderFunctionArgs, useLoaderData } from 'react-router'

const load = async ({ context }: LoaderFunctionArgs) => {
  const services_highlight = context.cols.get(ServiceHighlight)

  const services = await services_highlight.find(ServiceHighlight.all, {})

  return { services }
}

const head = () => ({
  title: 'Home | Infinitydoc',
})

export function render() {
  const { services } = useLoaderData<typeof load>()

  return (
    <div className='relative bg-background'>
      <header className='sticky top-0 z-50 w-full bg-background backdrop-blur-sm drop-shadow-md h-20'>
        <div className='container max-w-7xl flex h-full w-full items-center justify-between'>
          <a href='/' className='flex items-center gap-3'>
            <img
              src='/images/logo-brand.svg'
              alt='Logo of infinitydoc'
              className='h-10 w-10'
            />
            <span className='text-xl font-bold text-brand'>infinitydoc</span>
          </a>

          <nav>
            <ul className='flex items-center gap-16 font-medium'>
              <button className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
                Services
                <Icons.ChevronDown
                  className='relative top-[1px] ml-2 size-4 transition duration-200 group-hover:rotate-180'
                  aria-hidden='true'
                />
              </button>

              <button className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
                Contacts
                <Icons.ChevronDown
                  className='relative top-[1px] ml-2 size-4 transition duration-200 group-hover:rotate-180'
                  aria-hidden='true'
                />
              </button>

              <a
                href='/about-us'
                className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              >
                About us
              </a>

              <a
                href='/guides'
                className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              >
                Guides
              </a>
            </ul>
          </nav>

          <div></div>
        </div>
      </header>

      <section className='w-full overflow-hidden py-24'>
        <div className='container max-w-7xl mx-auto text-foreground relative grid grid-cols-12'>
          <div className='relative col-span-6 flex flex-col gap-10 py-10'>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-1'>
                <div className='h-1 w-8 bg-brand'></div>
                <span className='uppercase text-brand text-lg ml-1'>
                  infinitydoc studio
                </span>
              </div>

              <h1 className='text-6xl font-medium'>
                An available doctor <br />
                near you{' '}
                <span className='font-serif font-semibold italic animate-gradient py-2 inline-block bg-gradient-to-r from-blue-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                  at any time
                </span>
              </h1>
            </div>

            <p className='max-w-2xl text-xl'>
              Have the peace of mind of always having a doctor available for
              you, at any time.
            </p>

            <div className='flex items-center gap-5'>
              <button className='rounded-xl bg-primary bg-gradient-to-r px-14 py-4 text-lg font-medium text-white shadow-md transition-colors hover:bg-primary/80'>
                Book a visit
              </button>

              {
                /* <button className='rounded-lg px-10 py-3 text-lg font-semibold text-enutral-700 transition-colors hover:bg-neutral-100'>
                Learn more
              </button> */
              }
            </div>
          </div>

          <div className='col-span-6 w-full flex min-h-0 justify-end'>
            <div className='relative px-20'>
              <InfinityDoctor className='h-full w-full' />
              <Lightbulb className='size-24 absolute top-0 right-0' />
              <Calendar className='size-20 absolute top-7 left-10' />
              <HandShake className='size-24 absolute top-1/2 left-0' />
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 text-foreground  shadow-section'>
        <div className='flex flex-col gap-12 container max-w-7xl'>
          <div className='flex items-center gap-4'>
            <Puzzle className='size-24' />
            <div className='flex flex-col gap-3'>
              <h2 className='text-3xl font-medium'>
                Few things done{' '}
                <span className='font-serif text-brand italic font-semibold'>
                  right
                </span>
              </h2>
              <p className='text-lg'>
                Choose the service that best suits your needs
              </p>
            </div>
          </div>

          <div className='grid grid-cols-4 gap-5 auto-rows-auto'>
            {services.map((service) => (
              <div
                key={service.name}
                className='w-full aspect-square rounded-xl group border-2 border-transparent transition-all shadow hover:border-brand hover:-translate-y-1 bg-surface p-6 cursor-pointer'
              >
                <div className='flex flex-col gap-5'>
                  <Icons.Microphone className='text-brand' />
                  <h3 className='text-xl font-medium'>
                    {service.name}
                  </h3>
                  <p className=''>
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-3xl font-medium text-center'>
              More than <span className='font-semibold text-brand'>100</span>
              {' '}
              customers have already trusted us
            </h2>

            <p className='text-lg text-center'>
              Don't take our word for it, see what our customers say
            </p>
          </div>
          <ReviewsMarquee />
        </div>
      </section>

      <section className='py-20 text-foreground bg-gradient-to-t from-[#f7f7ff] to-[#fafaf9] from-70% shadow-section'>
        <div className='container max-w-7xl flex flex-col gap-10'>
          <div>
            <h2 className='text-3xl font-medium text-center'>
              How it{' '}
              <span className='font-serif text-brand italic'>
                works.
              </span>
            </h2>
          </div>

          <div>
            <DoctorOK />
          </div>
        </div>
      </section>

      <section className='py-20 text-foreground'>
        <div className='w-full mx-4 md:mx-10 lg:mx-20 py-16 rounded-xl shadow-prominent md:px-10 lg:px-20 max-w-6xl xl:mx-auto bg-white'>
          <div className='flex w-full gap-16'>
            <div className='flex flex-col justify-center gap-5'>
              <span className='uppercase text-violet-400 font-medium'>
                appointments
              </span>
              <p className='text-4xl font-medium'>
                Let us take care of your health
              </p>
              <p>
                We are reachable in many ways, choose the one that best suits
                you.
              </p>
            </div>

            <div className='w-full min-w-max grid grid-cols-2 gap-x-20 gap-y-5 auto-rows-auto'>
              <Icons.Globe className='size-10 stroke-1 text-violet-400' />

              <Icons.PhoneCalling className='size-10 stroke-1 text-violet-400' />

              <div className='flex flex-col gap-4'>
                <h2 className='text-xl font-semibold'>Visit us on</h2>
                <p className='text-lg'>
                  Piazzale Caiazzo, 2 Milano, 20124
                </p>

                <a
                  href='#'
                  className='font-medium text-brand group hover:underline'
                >
                  Open in Google Maps{' '}
                  <Icons.ChevronRight className='size-4 stroke-2 inline-block transition-transform will-change-transform group-hover:translate-x-1' />
                </a>
              </div>

              <div className='flex flex-col gap-4'>
                <h2 className='text-xl font-semibold'>Contact us</h2>
                <span className='font-medium text-neutral-500'>
                  Phone number
                </span>
                <a href='tel:+39021234567' className='text-lg font-semibold'>
                  +39 02 1234567
                </a>
              </div>

              <hr className='w-full mx-auto h-0.5 bg-neutral-400/40' />
              <hr className='w-full mx-auto h-0.5 bg-neutral-400/40' />

              <p className='max-w-60 font-medium text-neutral-500'>
                Availability to schedule appointments 24 hours a day, 7 days a
                week.
              </p>

              <div className='flex flex-col gap-3'>
                <span className='font-medium text-neutral-500'>
                  Email address
                </span>
                <a
                  href='mailto:info@infinitydoc.it'
                  className='text-lg font-semibold'
                >
                  info@infinitydoc.it
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='pt-16'>
        <div className='relative w-full max-w-7xl bg-violet-500/20 py-20 pl-40 pr-20 mx-auto rounded-2xl'>
          <div className='flex items-center justify-between'>
            <img
              src='/images/rating.png'
              alt=''
              className='absolute size-60 -left-20 -bottom-10'
            />

            <div className='flex flex-col -mt-14 md:mt-0 md:col-start-2 md:row-start-1 md:pt-4 md:pr-8 lg:pt-0 lg:min-w-56 max-w-2xl'>
              <h3 className='font-medium text-3xl text-center md:text-2xl md:text-left lg:text-2xl xl:text-3xl'>
                Your opinion is valuable to us
              </h3>
              <p className='font-normal text-center md:text-left mt-8 md:mt-2 lg:pr-0 lg:mt-3'>
                Reviews are important to improve our services, experience and
                support. We would like to know your opinion.
              </p>
            </div>

            <div>
              <GoogleRating value={3.9} />
            </div>
          </div>
        </div>
      </section>

      <footer className='flex flex-col py-12 px-4 gap-10 lg:px-0 md:grid xl:max-w-screen-xl xl:mx-auto'>
        <div className='flex flex-col gap-5 md:col-start-1 md:row-start-1 lg:pl-20'>
          <div className='text-2xl lg:hidden'>
            <p>
              An available doctor, <br /> near you at any time
            </p>
          </div>
        </div>
        <div className='text-2xl hidden lg:block col-start-1 row-start-3 lg:pl-20'>
          <p>
            An available doctor, <br /> near you at any time
          </p>
        </div>

        <ul className='flex flex-row gap-2 md:col-start-1 md:row-start-3 lg:col-start-4 lg:row-start-1 lg:pr-20'>
          <li title='Instagram'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.instagram.com/elty_it/'
            >
            </a>
          </li>
          <li title='Facebook'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.facebook.com/elty.it'
            >
            </a>
          </li>
          <li title='Linkedin'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.linkedin.com/company/davincisalute/'
            >
            </a>
          </li>
          <li title='Medium'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://medium.com/davinci-healthcare'
            >
            </a>
          </li>
        </ul>
        <hr className='hidden lg:block border-neutral-lighter w-full lg:row-start-2 lg:col-span-4 lg:col-start-1' />
        <nav className='md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-3 lg:row-start-3 lg:col-start-2 lg:col-span-3 lg:row-span-2 lg:pr-20 lg:flex lg:flex-row lg:justify-end '>
          <ul className='flex flex-col gap-8 md:flex-row lg:w-full lg:justify-between lg:max-w-[700px] lg:pl-20 xl:pl-0'>
            <li className='flex flex-col gap-5'>
              <h2 className='text-brand font-semibold'>PER I PAZIENTI</h2>
              <nav>
                <ul role='menu' className='flex flex-col gap-3 '>
                  <li role='presentation'>
                    <a
                      role='menuitem'
                      href='https://elty.it/guide'
                      className='focus:text-text-body hover:text-text-body transition-colors text-sm'
                    >
                      Blog
                    </a>
                  </li>

                  <li role='presentation'>
                    <a
                      role='menuitem'
                      href='https://supporto.elty.it/hc/it/requests/new'
                      className='focus:text-text-body hover:text-text-body transition-colors text-sm'
                    >
                      Bookings
                    </a>
                  </li>

                  <li role='presentation'>
                    <a
                      role='menuitem'
                      className='focus:text-text-body hover:text-text-body transition-colors text-sm'
                      href='/prenota-visita/tutte'
                    >
                      Services
                    </a>
                  </li>
                </ul>
              </nav>
            </li>
            <li className='flex flex-col gap-5'>
              <h2 className='text-brand font-semibold'>RESOURCES</h2>
              <nav>
                <ul role='menu' className='flex flex-col gap-3 '>
                  <li role='presentation'>
                    <a
                      role='menuitem'
                      href='https://medico.davinci.elty.it'
                      className='focus:text-text-body hover:text-text-body transition-colors text-sm'
                    >
                      Terms and conditions
                    </a>
                  </li>
                  <li role='presentation'>
                    <a
                      role='menuitem'
                      className='focus:text-text-body hover:text-text-body transition-colors text-sm'
                      href='/welfare-aziendale'
                    >
                      Privacy
                    </a>
                  </li>
                </ul>
              </nav>
            </li>
            <li className='flex flex-col gap-5'>
              <h2 className='text-brand font-semibold'>INFINITYDOC</h2>
              <nav>
                <ul role='menu' className='flex flex-col gap-3 '>
                  <li role='presentation'>
                    <a
                      role='menuitem'
                      className='focus:text-text-body hover:text-text-body transition-colors text-sm'
                      href='/chi-e-elty'
                    >
                      Chi siamo
                    </a>
                  </li>
                </ul>
              </nav>
            </li>
          </ul>
        </nav>
        <div className='flex flex-row items-center lg:col-start-1 lg:row-start-5 lg:pl-20'>
        </div>
        <div className='text-text-body text-xs lg:col-start-1 lg:row-start-4 lg:pl-20 [&amp;>p]:leading-[1.125rem]'>
          <p>
            <b>
              <span>Infinitydoc Milano</span>
            </b>
            <span>
              <br />
            </span>
            <span>Piazzale Caiazzo, 2 Milano, 20124, Milano</span>
            <span>
              <br />
            </span>
            <span>Partita IVA XXXXXXXXXXX e CF XXXXXXXXXX</span>
          </p>
        </div>
        <div className='text-text-body lg:flex flex-row text-xs lg:gap-2 lg:justify-end lg:items-end lg:col-start-2 lg:col-span-3 lg:row-start-5 lg:pr-20'>
          <div className='lg:whitespace-nowrap'>
            Infinitydoc Milano | All rights reserved
          </div>
          <nav>
            <ul className='flex flex-row items-center flex-wrap' role='menu'>
              <li
                role='presentation'
                className='whitespace-nowrap focus:text-black hover:text-black transition-colors'
              >
                <a role='menuitem' href='/privacy-policy'>Privacy Policy</a>
              </li>
              <li className='px-1' role='separator'>|</li>
              <li
                role='presentation'
                className='whitespace-nowrap focus:text-black hover:text-black transition-colors'
              >
                <a role='menuitem' href='/termini-e-condizioni-del-servizio'>
                  Terms &amp; Conditions
                </a>
              </li>
              <li className='px-1' role='separator'>|</li>
              <li
                role='presentation'
                className='whitespace-nowrap focus:text-black hover:text-black transition-colors'
              >
                <a role='menuitem' href='/informative/informativa-cookie'>
                  Cookies &amp; Policy
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export const LandingScreen = {
  render,
  load,
  head,
}
