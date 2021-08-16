/** @jsxRuntime classic */
/** @jsx jsx */
//@ts-nocheck
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Themed, jsx } from 'theme-ui'
import { Grid } from '@theme-ui/components'

import { ArrowLeft, ChevronUp } from '../../components/icons'
import OptionPicker from '@components/common/OptionPicker'
import { NextSeo } from 'next-seo'
import { useUI } from '@components/ui/context'
import { useAddItemToCart } from '@lib/shopify/storefront-data-hooks'
import {
  prepareVariantsWithOptions,
  prepareVariantsImages,
  getPrice,
} from '@lib/shopify/storefront-data-hooks/src/utils/product'
import Image from 'next/image'
import { LoadingDots, Sidebar } from '@components/ui'
import ProductDetails from '@components/ProductDetails/ProductDetails'
import Button from '../../blocks/Button/Button'
import ImageCarousel from '@components/common/ImageCarousel'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const ProductBox = ({
  product,
  renderSeo = true,
  description = product.description,
  title = product.title,
}) => {
  const addItem = useAddItemToCart()

  const [loading, setLoading] = useState(false)

  const mainSliderRef = useRef()
  const [mainSlideIndex, setMainSlideIndex] = useState(0)

  const colors = product?.options
    ?.find((option) => option?.name?.toLowerCase() === 'color')
    ?.values?.map((op) => op.value)

  const sizes = product?.options
    ?.find((option) => option?.name?.toLowerCase() === 'size')
    ?.values?.map((op) => op.value)

  const variants = useMemo(
    () => prepareVariantsWithOptions(product?.variants),
    [product?.variants]
  )

  // TODO: return when getting variants is working
  // const images = useMemo(() => prepareVariantsImages(variants, 'color'), [
  //   variants,
  // ])

  const [images, setImages] = useState([])

  const {
    openCart,
    toggleProductDetails,
    displayProductDetails,
    closeProductDetails,
  } = useUI()

  const [variant, setVariant] = useState(variants[0] || {})
  const [color, setColor] = useState(variant.color)
  const [size, setSize] = useState(variant.size)

  // TODO: temporary setting up images because prepareVariantsImages is not working
  useEffect(() => {
    if (variant != null) {
      var imgArr = []
      imgArr.push(variant.image.src)
      imgArr.push('https://m.media-amazon.com/images/I/31ugsNrg7+L._AC_.jpg')
      imgArr.push('https://m.media-amazon.com/images/I/31xfGPIol8L._AC_.jpg')
      imgArr.push('https://m.media-amazon.com/images/I/31PBTfWT5BL._AC_.jpg')

      setImages(imgArr)
    }
  }, [variant])

  function IsJsonString(str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  //TODO: What does this do?
  useEffect(() => {
    const newVariant = variants.find((variant) => {
      return (
        (variant.size === size || !size) && (variant.color === color || !color)
      )
    })

    if (variant.id !== newVariant?.id) {
      setVariant(newVariant)
      setPeakingImage(null)
    }
  }, [size, color, variants, variant.id])

  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem(variant.id, 1)
      console.log('item added')
      openCart()
      setLoading(false)
    } catch (err) {
      console.log({ err })
      setLoading(false)
    }
  }

  const handleMainSliderChange = (index) => {
    setMainSlideIndex(index)
  }

  console.log('product.images.length')
  console.log(product.images.length)
  console.log('***************')

  console.log('variants')
  console.log(variants.length)
  console.log('***************')

  if (variant.image) {
    console.log('variant.image.src')
    console.log(variant.image.src)
    console.log('***************')
  }

  console.log('size')
  console.log(size)
  console.log('***************')

  console.log('color')
  console.log(color)
  console.log('***************')

  return (
    <React.Fragment>
      {renderSeo && (
        <NextSeo
          title={title}
          description={description}
          openGraph={{
            type: 'website',
            title: title,
            description: description,
            images: [
              {
                url: product.images?.[0]?.src,
                width: 800,
                height: 600,
                alt: title,
              },
            ],
          }}
        />
      )}

      {/* Top-most divider */}
      <div
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
        className="type-wrapper"
      >
        <Slider
          ref={mainSliderRef}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={false}
          dots={false}
          swipe={false}
          afterChange={handleMainSliderChange}
        >
          <div>
            <ImageCarousel images={images} />
          </div>
          <div>
            <ProductDetails
              details={
                IsJsonString(product.description)
                  ? JSON.parse(product.description)
                  : {}
              }
            />
          </div>
        </Slider>

        {/* Details and Specs */}
        <div
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            alignItems: 'center',
            marginBottom: '200px',
            marginLeft: '-70px',
            transform: 'rotate(90deg)',
            color: 'white',
            cursor: 'pointer',
            width: '200px',
            minWidth: '200px',
            textAlign: 'right',
          }}
        >
          {mainSlideIndex === 0 ? (
            <button
              onClick={() => {
                console.log(mainSliderRef)
                mainSliderRef?.current.slickPrev()
              }}
            >
              Details and Specs <ArrowLeft orientation="down" marginTop="0" />
            </button>
          ) : (
            <button onClick={() => mainSliderRef?.current.slickNext()}>
              <ArrowLeft orientation="right" marginTop="10" />
            </button>
          )}
        </div>

        <div
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            marginBottom: '50px',
            marginRight: '2%',
          }}
        >
          <h1 className="text-3xl text-white mb-0 pb-0">{title}</h1>
          <Grid columns={2}>
            {colors?.length && (
              <OptionPicker
                key="Color"
                name="Color"
                options={colors}
                selected={color}
                onChange={(event) => setColor(event.target.value)}
              />
            )}
            {sizes?.length && (
              <OptionPicker
                key="Size"
                name="Size"
                options={sizes}
                selected={size}
                onChange={(event) => setSize(event.target.value)}
              />
            )}
          </Grid>

          {/* Add to cart button */}
          <Button
            sx={{
              background:
                'linear-gradient(to left, #000 50%, #FFC391 50%) right',
              transition: '.5s ease-out',
              backgroundSize: '200%',
              ' &:hover': {
                boxShadow: '6px 5px 10px rgba(0,0,0,0.2)',
                color: '#000',
                backgroundPosition: 'left',
              },
            }}
            name="add-to-cart"
            disabled={loading}
            onClick={addToCart}
          >
            <span className="flex flex-row justify-between mr-2">
              <span>Bag {loading && <LoadingDots />}</span>
              {getPrice(variant.priceV2.amount, variant.priceV2.currencyCode)}
            </span>
          </Button>
          <br />
          <p sx={{ color: 'white' }}>Limited Edition of 200</p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ProductBox
