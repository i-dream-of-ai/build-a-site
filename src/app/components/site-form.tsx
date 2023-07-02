'use client'
import { IconPhotoAi } from "@tabler/icons-react";
import { Site } from "@/types/site";

export interface SiteProps {
    site: Site,
}

export default function SiteForm({site}:SiteProps) {
    //console.log(site);
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">General Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            This information will be displayed in your navbar and when you share the site URL.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-white">
                Site Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    value={site.content.title}
                    className="flex-1 border-0 bg-transparent p-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Hero Section</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">The top section of the site. This is the first section visitors see.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="sm:col-span-6">
              <label htmlFor="heroTitle" className="block text-sm font-medium leading-6 text-white">
                Hero Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <input
                    type="text"
                    name="heroTitle"
                    id="heroTitle"
                    autoComplete="heroTitle"
                    value={site.content.heroTitle}
                    className="flex-1 border-0 bg-transparent p-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Welcome"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                Hero Content
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  value={site.content.heroContent}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">Write a few sentences about yourself.</p>
            </div>

            
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Testimonial Section</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">Your business testimonal.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="sm:col-span-6">
              <label htmlFor="testimonial-name" className="block text-sm font-medium leading-6 text-white">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="testimonial-name"
                  id="testimonial-name"
                  value={site.content.testimonial.name}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="testimonial-content" className="block text-sm font-medium leading-6 text-white">
                Content
              </label>
              <div className="mt-2">
                <textarea
                  id="testimonial-content"
                  name="testimonial-content"
                  rows={3}
                  value={site.content.testimonial.content}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="testimonial-prompt" className="block text-sm font-medium leading-6 text-white">
                Testimonal Image Prompt
              </label>
              <div className="mt-2">
                <textarea
                  id="testimonial-prompt"
                  name="testimonial-prompt"
                  rows={3}
                  value={site.content.testimonialImage}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                
                  {site.content.testimonialImageURL ? (
                    <div>
                        <img src={site.content.testimonialImageURL} />
                    </div>
                  ):(
                    <div className="text-center">
                        <IconPhotoAi className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                            <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                            >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
              </div>
            </div>
            
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">About Us Section</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">A section to tell visitors about your business.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="sm:col-span-6">
              <label htmlFor="aboutus-title" className="block text-sm font-medium leading-6 text-white">
                About Us Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <input
                    type="text"
                    name="aboutus-title"
                    id="aboutus-title"
                    value={site.content.aboutUsTitle}
                    className="flex-1 border-0 bg-transparent p-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="About Us"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="aboutus-content" className="block text-sm font-medium leading-6 text-white">
                About Us Content
              </label>
              <div className="mt-2">
                <textarea
                  id="aboutus-content"
                  name="aboutus-content"
                  rows={4}
                  value={site.content.aboutUsContent}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">Write a few sentences about your business.</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="aboutus-image" className="block text-sm font-medium leading-6 text-white">
                About Us Image Prompt
              </label>
              <div className="mt-2">
                <textarea
                  id="aboutus-image"
                  name="aboutus-image"
                  rows={3}
                  value={site.content.aboutUsImage}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                
                  {site.content.aboutUsImageURL ? (
                    <div>
                        <img src={site.content.aboutUsImageURL} />
                    </div>
                  ):(
                    <div className="text-center">
                        <IconPhotoAi className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                            <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                            >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Features Section</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">You business features.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

          <div className="sm:col-span-6">
              <label htmlFor="feature-title" className="block text-sm font-medium leading-6 text-white">
                Feature Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="feature-title"
                  id="feature-title"
                  value={site.content.featureSectionTitle}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="feature-tagline" className="block text-sm font-medium leading-6 text-white">
                Feature Tagline
              </label>
              <div className="mt-2">
              <input
                  type="text"
                  name="feature-tagline"
                  id="feature-tagline"
                  value={site.content.featureSectionTagline}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="feature-content" className="block text-sm font-medium leading-6 text-white">
                Feature Tagline
              </label>
              <div className="mt-2">
                <textarea
                  id="feature-content"
                  name="feature-content"
                  rows={3}
                  value={site.content.featureSectionContent}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-white">
                Feature Image Prompt
              </label>
              <div className="mt-2">
                <textarea
                  id="heroImage"
                  name="heroImage"
                  rows={3}
                  value={site.content.heroImage}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                
                  {site.content.featureImageURL ? (
                    <div>
                        <img src={site.content.featureImageURL} />
                    </div>
                  ):(
                    <div className="text-center">
                        <IconPhotoAi className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                            <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                            >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
              </div>
            </div>
            
            <div className="col-span-6 grid grid-cols-6 gap-4 p-4 rounded-md ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            {site.content.features.map((feature:any, index:any)=>{

              return(
                <>
                <div className="sm:col-span-2">
                  <label htmlFor={`feature-${index}`} className="block text-sm font-medium leading-6 text-white">
                    {index + 1}. Feature Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name={`feature-${index}`}
                      id={`feature-${index}`}
                      value={feature.title}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor={`feature-content-${index}`} className="block text-sm font-medium leading-6 text-white">
                    {index + 1}. Feature Content
                  </label>
                  <div className="mt-2">
                    <textarea
                      id={`feature-content-${index}`}
                      name={`feature-content-${index}`}
                      rows={3}
                      value={feature.content}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
                
                </>
              )
            })}
            </div>
            
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">Footer</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            The section at the very bottom of your site. Use it to display your copywrite infomation.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
                <label htmlFor="copywrite" className="block text-sm font-medium leading-6 text-white">
                    Copywrite
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="copywrite"
                    id="copywrite"
                    value={site.content.copywrite}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                </div>
                </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-white">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  )
}
