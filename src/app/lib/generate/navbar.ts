import { Link } from "@/old.types/site"

interface NavbarSectionProps {
  title: string
  navbarItems: Link[]
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
  }
}

export function generateNavbar({
  title,
  navbarItems,
  colors,
}: NavbarSectionProps) {
  const itemHTML = navbarItems
    .map(
      (item) => `
    <li class="mr-3">
      <a class="inline-block py-2 px-4 ${colors.mainTextColor} no-underline" href="${item.href}">${item.name}</a>
    </li>
  `,
    )
    .join('')

  return `
    <nav class="${colors.mainTextColor} ${colors.mainBackgroundColor} p-2 mt-0 w-full">
      <div class="container mx-auto flex flex-wrap items-center">
        <div class="flex w-full md:w-1/2 justify-center md:justify-start ${colors.mainTextColor} font-extrabold">
          <a class="no-underline hover:${colors.mainTextColor} hover:no-underline" href="#">
            <span class="text-2xl pl-2">${title}</span>
          </a>
        </div>
        <div class="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
          <ul class="list-reset flex justify-between flex-1 md:flex-none items-center">
            ${itemHTML}
          </ul>
        </div>
      </div>
    </nav>
  `
}
