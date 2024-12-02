import { ServiceHighlight } from '@infinitydoc/model'
import { Button, EditorDialog } from '@infinitydoc/theme'
import { type LoaderFunctionArgs, useLoaderData } from 'react-router'
import { client_cols } from '../../configuration/index.ts'
// @deno-types="@types/react"
import { useState } from 'react'
import { NewServiceDialog } from '../../components/editor_new-service-dialog.tsx'

const load = async ({ context }: LoaderFunctionArgs) => {
  const services_highlight = context.cols.get(ServiceHighlight)

  const services = await services_highlight.find(ServiceHighlight.all, {})

  return { services }
}

const render = () => {
  const { services } = useLoaderData<typeof load>()
  const service_highlight = client_cols.get(ServiceHighlight)

  return (
    <section className='w-full overflow-hidden py-24'>
      <div className='container max-w-7xl mx-auto text-foreground relative px-20'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-3'>
            <a href='/' className='text-sm underline'>Back to website</a>
            <h1 className='text-4xl'>Services</h1>
            <p>
              This is the editor page for <b>services</b>
            </p>
          </div>

          <div>
            <NewServiceDialog />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
          {services.map((service) => (
            <div
              key={service.id}
              className='bg-background p-6 rounded-lg shadow-md'
            >
              <h2 className='text-2xl'>{service.title}</h2>
              <p>{service.description}</p>
              <button
                onClick={async () =>
                  globalThis.confirm(
                    'Are you sure you want to delete this service?',
                  ) && await service_highlight.remove(ServiceHighlight.all, {})}
                className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const ServicesEditorPage = { load, render }
