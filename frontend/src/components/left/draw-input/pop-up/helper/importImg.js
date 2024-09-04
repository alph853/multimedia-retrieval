export const importImages = async (iconNames) => {
  const images = {}
  await Promise.all(
    iconNames.map(async (icon) => {
      const image = await import(`../../../../../assets/icons/${icon}.png`)
      images[icon] = image.default
    })
  )
  return images
}
