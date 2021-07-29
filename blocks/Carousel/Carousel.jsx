import React from 'react'
import styled from 'styled-components'
import { ChevronUp } from '../../components/icons'

import Button from '../Button/Button'
import { H1 } from '../../components/Typography'
import { CSSTransition } from 'react-transition-group'
// import NextArrow from '../../assets/nextArrow.svg'

const Wrapper = styled.div`
  height: ${({ height }) => height}px;
  width: 100%;
  background: none;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .content {
    display: flex;
    flex-direction: column;
    margin-left: 50px;
    margin-bottom: 33px;
    z-index: 1;
    h1 {
      color: #ffffff;
    }
    .title2 {
      margin-top: -70px;
      margin-left: 25px;
      padding: 0px;
    }
    @media (max-width: 768px) {
margin: 3rem;
    }
  }
`

const NextButton = styled.button`
  width: fit-content;
  padding: 20px;
  position: absolute;
  margin-left: 50%;
  margin-bottom: 20px;
  background: none;
  border: none;
  color: white;
  transition: 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  &:hover {
    margin-bottom: 24px;
    transition: 0.3s ease-in-out;
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 260px;
    margin-left: 80%;
    font-size: 1.75rem;
    &:hover {
      margin-bottom: 270px;
    }
  }

`

const Video = styled.video`
  position: absolute;
  z-index: 0;
  height: ${(props) => props.height}px;
  object-fit: cover;
  top: 0;
  left: 0;
  width: 100%;
`

const ModelToggle = styled.div`
  position: absolute;
  button {
    color: white;
    padding: 15px;
  }
`

const ChevronDown = styled.div`
  transform: rotate(180deg);
`

const Carousel = (props) => {
  const { slides } = props

  const [height, setHeight] = React.useState(780)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [currentModel, setCurrentModel] = React.useState('model1')
  const [timeOfDay, setTimeOfDay] = React.useState('Day')
  const [scrollValue, setScrollValue] = React.useState(0)

  React.useEffect(() => {
    setHeight(window.innerHeight)
  }, [])

  // React.useEffect(() => {
  //   window.addEventListener(
  //     'wheel',
  //     (e) => {
  //       handleScroll(e, currentSlide)
  //     },
  //     { passive: false }
  //   )
  //   return function cleanup() {
  //     window.removeEventListener('wheel', (e) => {
  //       handleScroll(e, currentSlide)
  //     },{ passive: false })
  //   }
  // })

  // const handleScroll = React.useCallback((event, cs) => {
  //   const isScrollingDown = event.deltaY > 1 && cs < slides.length
  //   const isScrollingUp = event.deltaY < 1 && cs > 0 && !window.scrollY
  //
  //   if (isScrollingDown) {
  //     console.log('scrolling down', event.deltaY)
  //     //if scroll value is less than 100,
  //     console.log({scrollValue, cs})
  //     if(scrollValue<100){
  //       setScrollValue(scrollValue+event.deltaY)
  //     } else {
  //       setScrollValue(0)
  //       updateSlide()
  //     event.stopPropagation()
  //   }}
  //   // console.log({ cs })
  //   if (isScrollingUp) {
  //     event.stopPropagation()
  //     setCurrentSlide(cs - 1)
  //     console.log('scrolling up', event.deltaY)
  //   }
  // }, [])

  if (!slides) {
    return (
      <Wrapper>
        <p>Add some slides</p>
      </Wrapper>
    )
  }
  const {
    image,
    titleLine1,
    titleLine2,
    buttonLabel,
    buttonUrl,
  } = props.slides[currentSlide]
  const collectionAvailable = true

  function updateSlide() {
    const slide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    setCurrentSlide(slide)
  }
  function updateModel(model) {
    const slide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    setCurrentSlide(slide)
  }

  const currentSlideVideos = slides[currentSlide].videos
    ? slides[currentSlide].videos[`${currentModel}${timeOfDay}`]
    : ''

  return (
    // <CSSTransition>
    <Wrapper height={height}>
      <Video
        height={height}
        src={currentSlideVideos && currentSlideVideos}
        autoPlay
        poster={slides[currentSlide].image}
        muted
        loop
      ></Video>
      <div className="content">
        <H1>{titleLine1}</H1>
        {titleLine2 && <H1 className="title2">{titleLine2}</H1>}
        {collectionAvailable && (
          <Button displayAs="link" href={buttonUrl}>
            {buttonLabel}
          </Button>
        )}
      </div>
      <ModelToggle>
        <button
          onClick={() => {
            setCurrentModel('model1')
          }}
        >
          {slides[currentSlide].videos?.model1Name}
        </button>
        <button
          onClick={() => {
            setCurrentModel('model2')
          }}
        >
          {slides[currentSlide].videos?.model2Name}
        </button>
        <button
          onClick={() => {
            setTimeOfDay('Night')
          }}
        >
          Night
        </button>
        <button
          onClick={() => {
            setTimeOfDay('Dusk')
          }}
        >
          Dusk
        </button>
        <button
          onClick={() => {
            setTimeOfDay('Day')
          }}
        >
          Day
        </button>{' '}
        <button
          onClick={() => {
            setTimeOfDay('Dawn')
          }}
        >
          Dawn
        </button>
      </ModelToggle>

      <NextButton onClick={updateSlide}>
        {currentSlide + 1} out of {slides.length}{' '}
        <ChevronDown>
          <ChevronUp />
        </ChevronDown>
      </NextButton>
    </Wrapper>
    // </CSSTransition>
  )
}

export default Carousel
