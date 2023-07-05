'use client'

import { IconArrowsExchange, IconPhotoAi, IconRecycle, IconRefresh } from '@tabler/icons-react'
import { Site } from '@/types/site'
import React, { useState } from 'react'
import { Feature } from '@/types/feature'
import { toast } from 'react-hot-toast'

export interface SiteProps {
  site: Site
}

export default function SiteForm({ site }: SiteProps) {

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [siteData, setSiteData] = useState(site.content);

  const handleInputChange = (index: number, key: keyof Feature, value: string) => {
    const newFeatures = [...siteData.features];
    newFeatures[index][key] = value;
    setSiteData({...siteData, features: newFeatures});
  };

  const handleFieldChange = (field: string, value: string) => {
    setSiteData({...siteData, [field]: value});
  };


  async function updateSite(e:any){
    e.preventDefault();

    // Send the siteData state to the server
    const response = await fetch(`/api/sites/${site._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketName:site.bucketName,
        siteData
      }),
    });

    if (!response.ok) {
      toast.error('Failed to update site');
    } else {
      toast.success('Site updated successfully');
    }
  }

  async function generateNewImage(generator:string, field: string, prompt: string, height:string, width:string){
    try {
      setIsGeneratingImage(true);
      const res = await fetch(('/api/image'),{
        method:"POST",
        body:JSON.stringify({
          generator,
          prompt,
          field, 
          siteId: site._id,
          height,
          width
        })
      });
      const response = await res.json();
      if(!res.ok){
        toast.error(response.error)
        console.log(response)
      }
      console.log(response);
      setIsGeneratingImage(false);
    } catch (error) {
      setIsGeneratingImage(false);
      console.error('generateNewFeatureImage Error: ',error)
    }
  }

  return (
    <form onSubmit={updateSite}>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            General Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            This information will be displayed in your navbar and when you share
            the site URL.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-white"
              >
                Site Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    value={siteData.title}
                    onChange={(e)=>handleFieldChange('title', e.target.value)}
                    className="flex-1 border-0 bg-transparent p-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Hero Section
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            The top section of the site. This is the first section visitors see.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="heroTitle"
                className="block text-sm font-medium leading-6 text-white"
              >
                Hero Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <input
                    type="text"
                    name="heroTitle"
                    id="heroTitle"
                    autoComplete="heroTitle"
                    value={siteData.heroTitle}
                    onChange={(e)=>handleFieldChange('heroTitle', e.target.value)}
                    className="flex-1 border-0 bg-transparent p-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Welcome"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-white"
              >
                Hero Content
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  value={siteData.heroContent}
                  onChange={(e)=>handleFieldChange('heroContent', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Write a few sentences about yourself.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Testimonial Section
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Your business testimonal.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="testimonial-name"
                className="block text-sm font-medium leading-6 text-white"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="testimonial-name"
                  id="testimonial-name"
                  value={siteData.testimonial.name}
                  onChange={(e)=>handleFieldChange('testimonalName', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="testimonial-content"
                className="block text-sm font-medium leading-6 text-white"
              >
                Content
              </label>
              <div className="mt-2">
                <textarea
                  id="testimonial-content"
                  name="testimonial-content"
                  rows={3}
                  value={siteData.testimonial.content}
                  onChange={(e)=>handleFieldChange('testimonalContent', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="testimonial-prompt"
                className="block text-sm font-medium leading-6 text-white"
              >
                Testimonal Image Prompt
              </label>
              <div className="mt-2">
                <textarea
                  id="testimonial-prompt"
                  name="testimonial-prompt"
                  rows={3}
                  value={siteData.testimonialImagePrompt}
                  onChange={(e)=>handleFieldChange('testimonialImagePrompt', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                {siteData.testimonialImageURL ? (
                  <div>
                    {/* <button disabled={isGeneratingImage} className='disabled:animate-pulse disabled:cursor-wait px-4 py-2 bg-purple-600 text-white rounded-md mb-4' onClick={()=>generateNewImage('dalle','testimonialImage',siteData.testimonialImage, '512', '512')}>Generate Image with Dalle</button> */}
                    <button disabled={isGeneratingImage} className='disabled:animate-pulse disabled:cursor-wait px-4 py-2 bg-purple-600 text-white flex items-center justify-center gap-1 rounded-md mb-4' onClick={()=>generateNewImage('stable','testimonialImage',siteData.testimonialImagePrompt, '512', '512')}>Regenerate Image <IconRefresh className='w-5 h-5'/> </button>
                    <img className='rounded-md' src={siteData.testimonialImageURL} />
                  </div>
                ) : (
                  <div className="text-center">
                    <IconPhotoAi
                      className="mx-auto h-12 w-12 text-gray-500"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            About Us Section
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            A section to tell visitors about your business.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="aboutus-title"
                className="block text-sm font-medium leading-6 text-white"
              >
                About Us Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <input
                    type="text"
                    name="aboutus-title"
                    id="aboutus-title"
                    value={siteData.aboutUsTitle}
                    onChange={(e)=>handleFieldChange('aboutUsTitle', e.target.value)}
                    className="flex-1 border-0 bg-transparent p-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="About Us"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="aboutus-content"
                className="block text-sm font-medium leading-6 text-white"
              >
                About Us Content
              </label>
              <div className="mt-2">
                <textarea
                  id="aboutus-content"
                  name="aboutus-content"
                  rows={4}
                  value={siteData.aboutUsContent}
                  onChange={(e)=>handleFieldChange('aboutUsContent', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Write a few sentences about your business.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="aboutus-image"
                className="block text-sm font-medium leading-6 text-white"
              >
                About Us Image Prompt
              </label>
              <div className="mt-2">
                <textarea
                  id="aboutus-image"
                  name="aboutus-image"
                  rows={3}
                  value={siteData.aboutUsImagePrompt}
                  onChange={(e)=>handleFieldChange('aboutUsImagePrompt', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                {siteData.aboutUsImageURL ? (
                  <div>
                    {/* <button disabled={isGeneratingImage} className='disabled:animate-pulse disabled:cursor-wait px-4 py-2 bg-purple-600 text-white rounded-md mb-4' onClick={()=>generateNewImage('dalle','aboutUsImage',siteData.aboutUsImagePrompt, '576', '1024')}>Generate Image with Dalle</button> */}
                    <button disabled={isGeneratingImage} className='disabled:animate-pulse disabled:cursor-wait px-4 py-2 bg-purple-600 text-white flex items-center justify-center gap-1 rounded-md mb-4' onClick={()=>generateNewImage('stable','aboutUsImage',siteData.aboutUsImagePrompt, '576', '1024')}>Regenerate Image <IconRefresh className='w-5 h-5'/> </button>
                    <img className='rounded-md' src={siteData.aboutUsImageURL} />
                  </div>
                ) : (
                  <div className="text-center">
                    <IconPhotoAi
                      className="mx-auto h-12 w-12 text-gray-500"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Features Section
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            You business features.
          </p>

          <div className="mt-10 flex flex-col gap-x-6 gap-y-8 ">
            <div className="w-full">
              <label
                htmlFor="feature-title"
                className="block text-sm font-medium leading-6 text-white"
              >
                Feature Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="feature-title"
                  id="feature-title"
                  value={siteData.featureSectionTitle}
                  onChange={(e)=>handleFieldChange('featureSectionTitle', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="feature-tagline"
                className="block text-sm font-medium leading-6 text-white"
              >
                Feature Tagline
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="feature-tagline"
                  id="feature-tagline"
                  value={siteData.featureSectionTagline}
                  onChange={(e)=>handleFieldChange('featureSectionTagline', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="feature-content"
                className="block text-sm font-medium leading-6 text-white"
              >
                Feature Tagline
              </label>
              <div className="mt-2">
                <textarea
                  id="feature-content"
                  name="feature-content"
                  rows={3}
                  value={siteData.featureSectionContent}
                  onChange={(e)=>handleFieldChange('featureSectionContent', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-white"
              >
                Feature Image Prompt
              </label>
              <div className="mt-2">
                <textarea
                  id="heroImage"
                  name="heroImage"
                  rows={3}
                  value={siteData.heroImagePrompt}
                  onChange={(e)=>handleFieldChange('heroImagePrompt', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 p-6">
                {siteData.featureImageURL ? (
                  <div>
                    {/* <button disabled={isGeneratingImage} className='disabled:animate-pulse disabled:cursor-wait px-4 py-2 bg-purple-600 text-white rounded-md mb-4' onClick={()=>generateNewImage('dalle','featureImage',siteData.heroImagePrompt, '512', '512')}>Generate Image with Dalle</button> */}
                    <button disabled={isGeneratingImage} className='disabled:animate-pulse disabled:cursor-wait px-4 py-2 bg-purple-600 text-white flex items-center justify-center gap-1 rounded-md mb-4' onClick={()=>generateNewImage('stable','featureImage',siteData.heroImagePrompt, '576', '1024')}>Regenerate Image <IconRefresh className='w-5 h-5'/> </button>
                    <img className='rounded-md' src={siteData.featureImageURL} />
                  </div>
                ) : (
                  <div className="text-center">
                    <IconPhotoAi
                      className="mx-auto h-12 w-12 text-gray-500"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-6 grid grid-cols-6 gap-4 p-4 rounded-md ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500">

                  {site.content.features.map((feature:Feature, index:number) => (
                    <React.Fragment key={index}>
                      <div className="col-span-6 sm:col-span-2">
                        <label
                          htmlFor={`feature-${index}`}
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          {index + 1}. Feature Title
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name={`feature-${index}`}
                            id={`feature-${index}`}
                            value={feature.title}
                            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
            
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor={`feature-content-${index}`}
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          {index + 1}. Feature Content
                        </label>
                        <div className="mt-2">
                          <textarea
                            id={`feature-content-${index}`}
                            name={`feature-content-${index}`}
                            rows={3}
                            value={feature.content}
                            onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Footer
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            The section at the very bottom of your site. Use it to display your
            copywrite infomation.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="copywrite"
                className="block text-sm font-medium leading-6 text-white"
              >
                Copywrite
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="copywrite"
                  id="copywrite"
                  value={siteData.copywrite}
                  onChange={(e)=>handleFieldChange('copywrite', e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
        >
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
