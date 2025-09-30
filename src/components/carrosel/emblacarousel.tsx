import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback } from 'react'

import { Badge } from '../ui/badge'
import { DotButton, useDotButton } from './emblacarouseldotbutton'

type SlideType = {
  id: number
  text: string
}

type PropType = {
  slides: SlideType[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick,
  )

  return (
    <section className="mx-auto max-w-3xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-8 flex">
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-none px-8">
              <div className="flex h-[19rem] select-none flex-col justify-evenly rounded-2xl text-4xl font-semibold">
                <div>
                  <span className="text-orange-500">Kariri</span>
                  Shop
                </div>
                <div>{slide.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] justify-between">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`flex w-10 items-center justify-center`}
            >
              {index === selectedIndex ? (
                <Badge variant="baged" />
              ) : (
                <Badge variant="secondary" />
              )}
            </DotButton>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
