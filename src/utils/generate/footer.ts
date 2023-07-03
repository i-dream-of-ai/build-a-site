interface FooterSectionProps {
  copywrite: string
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
  }
}

export function generateFooter({ copywrite, colors }: FooterSectionProps) {
  return `
      <footer class="${colors.mainBackgroundColor} p-6 mt-0 w-full">
        <div class="container mx-auto text-center">
          <p class="${colors.mainTextColor}">${copywrite}</p>
        </div>
      </footer>
    `
}
