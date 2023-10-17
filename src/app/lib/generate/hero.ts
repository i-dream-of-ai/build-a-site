interface HeroSectionProps {
  title: string
  heroTitle: string
  heroContent: string
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
    gradientFromColor: string
    gradientToColor: string
  }
}

export function generateHeroSection({
  title,
  heroTitle,
  heroContent,
  colors,
}: HeroSectionProps): string {
  return `
    <div class="bg-white">
      <header class="absolute inset-x-0 top-0 z-50">
        <nav class="flex items-center justify-between p-6 lg:px-8 mx-auto max-w-6xl" aria-label="Global">
          <div class="flex lg:flex-1">
            <a href="#" class="-m-1.5 p-1.5 font-semibold text-lg">
              ${title}
            </a>
          </div>
          <div class="flex lg:hidden">
            <button id="open-menu-button" type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div class="hidden lg:flex lg:gap-x-12">
            <a href="#features" class="text-sm font-semibold leading-6 text-gray-900">Features</a>
            <a href="#about-us" class="text-sm font-semibold leading-6 text-gray-900">About Us</a>
            <a href="#testimonials" class="text-sm font-semibold leading-6 text-gray-900">Testimonials</a>
            <a href="#contact-us" class="text-sm font-semibold leading-6 text-gray-900">Contact Us</a>
          </div>
        </nav>
        <!-- Mobile menu, show/hide based on menu open state. -->
        <div id="mobile-menu" class="lg:hidden hidden" role="dialog" aria-modal="true">
          <!-- Background backdrop, show/hide based on slide-over state. -->
          <div class="fixed inset-0 z-50"></div>
          <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div class="flex items-center justify-between">
              <a href="/" class="-m-1.5 p-1.5 font-semibold text-lg">
                ${title}
              </a>
              <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" id="close-menu-button">
                <span class="sr-only">Close menu</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="mt-6 flow-root">
              <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <a id="menu-item-features" href="#features" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a>
                <a id="menu-item-about-us" href="#about-us" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">About Us</a>
                <a id="menu-item-testimonials" href="#testimonials" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Testimonials</a>
                <a id="menu-item-contact-us" href="#contact-us" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Contact Us</a>
              </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr ${colors.gradientFromColor} ${colors.gradientToColor} opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
        </div>
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">${heroTitle}</h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">${heroContent}</p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <a href="#contact-us" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
              <a href="#features" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
        </div>
      </div>
    </div>
    <script>
      document.getElementById('open-menu-button').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.remove('hidden');
      });

      document.getElementById('close-menu-button').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.add('hidden');
      });

      // Close the menu when a menu item is clicked
      ['features', 'about-us', 'testimonials', 'contact-us'].forEach(function(id) {
        document.getElementById('menu-item-' + id).addEventListener('click', function() {
          document.getElementById('mobile-menu').classList.add('hidden');
        });
      });
    </script>
    `
}
