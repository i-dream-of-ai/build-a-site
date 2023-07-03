interface ContactUsSectionProps {
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
  }
}

export function generateContactUsSection({ colors }: ContactUsSectionProps) {
  return `
      <section class="w-full ${colors.secondaryBackgroundColor}" id="contact-us">
      <div class="max-w-xl mx-auto px-6 py-12">
        <h2 class="text-4xl font-bold text-center ${colors.secondaryTextColor} mb-8">Contact Us</h2>
        <form>
          <div class="mb-4">
            <label class="block ${colors.secondaryTextColor} text-sm font-bold mb-2" for="name">Name</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 ${colors.secondaryTextColor}/90 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your name">
          </div>
          <div class="mb-4">
            <label class="block ${colors.secondaryTextColor} text-sm font-bold mb-2" for="email">Email</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 ${colors.secondaryTextColor}/90 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Your email">
          </div>
          <div class="mb-4">
            <label class="block ${colors.secondaryTextColor} text-sm font-bold mb-2" for="message">Message</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 ${colors.secondaryTextColor}/90 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Your message"></textarea>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Send
            </button>
          </div>
        </form>
        </div>
      </section>
    `
}
