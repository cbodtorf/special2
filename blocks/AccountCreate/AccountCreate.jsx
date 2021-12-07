import React from 'react'
import FancyTextInput from '../../components/ui/Form/FancyTextInput'
import { LoadingDots } from '../../components/ui'
import { validateEmail } from '../../lib/validateEmail'
import { ArrowLeft, Cross, SpecialLogo } from '../../components/icons'
import { grained } from '../../lib/grain'
import Cookie from 'js-cookie'
import styled from 'styled-components'
import useAudio from '../Carousel/useAudio'
import FancyPhoneInput from '../../components/ui/Form/FancyPhoneInput'
import Checkbox from '../../components/ui/Form/Checkbox'
import klaviyoConfig from '@config/klaviyo'
import { isMobile } from '../../lib/isMobile'

const ConfirmButton = styled.button`
  font-family: 'RayJohnson';
  font-size: 1.75rem;
  background: black;
  color: white;
  padding: 0.25rem;
  z-index: 10;
  &:disabled {
    background: #555;
  }
`

const Signup = ({
  content,
  finePrint,
  title,
  declineButtonLabel,
  secondaryContent,
  sound,
  titleFont = 'Nova Stamp Bold',
  contentFont = 'InputMono',
  secondaryContentFont = 'Nova Stamp Bold',
  finePrintFont = 'InputMono',
  consent = 'I agree to Spec_ial’s terms of service and give my consent receive emails and sms messages',
}) => {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phoneNumber, setPhone] = React.useState('')
  const [agree, setAgree] = React.useState(false)
  const [error, setError] = React.useState('')
  const [playing, toggle] = useAudio(sound)
  const [apiKey] = React.useState(klaviyoConfig.apiKey)
  const [list_id] = React.useState(klaviyoConfig.list_id)
  const [_isMobile, setIsMobile] = React.useState(true)

  const [formStatus, setFormStatus] = React.useState('initial')
  function decline() {
    Cookie.set('account', 'declined', { expires: 7 })
    window.location.href = '/'
  }
  React.useEffect(() => {
    setIsMobile(isMobile())
    grained('accountCreate', {
      animate: true,
      patternWidth: 100,
      patternHeight: 100,
      grainOpacity: 0.04,
      grainDensity: 1.79,
      grainWidth: 4.27,
      grainHeight: 1,
    })
  }, [])

  async function submitForm() {
    const first_name = name.split(' ')[0]
    const last_name = name.split(' ')[name.split(' ').length - 1]

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profiles: [
          {
            email,
            phone_number: phoneNumber,
            first_name,
            last_name,
            sms_consent: true,
          },
        ],
      }),
    }
    const url = `https://a.klaviyo.com/api/v2/list/${list_id}/subscribe?api_key=${apiKey}`

    // var urlencoded = new URLSearchParams()
    // urlencoded.append('g', 'XKvFZS')
    // urlencoded.append('email', email)
    // urlencoded.append('phone_number', `+${phoneNumber}`)
    // urlencoded.append('first_name', name.split(' ')[0])
    // urlencoded.append('last_name', name.split(' ')[name.split(' ').length - 1])
    // urlencoded.append('sms_consent', 'true')
    // urlencoded.append('$consent', '["sms", "email"]')
    //
    // const url = 'https://manage.kmail-lists.com/ajax/subscriptions/subscribe'
    const response = await fetch(url, options)
    return response.json()
  }
  function handleSubmit() {
    //set state to loading
    setFormStatus('loading')
    submitForm()
      .then((r) => {
        if (r.errors.length) {
          setFormStatus('error')
          setError(r.errors[0])
        } else {
          setFormStatus('success')
          window.location.href = '/home'
        }
      })
      .catch((r) => {
        setFormStatus('error')
        if (r?.errors?.length) {
          setError(r?.errors[0])
        } else {
          setError('Something went wrong. Please try again later.')
        }
      })
  }

  function doSetFormStatus() {
    if (validateEmail(email) && agree) {
      setFormStatus('ready')
    } else {
      setFormStatus('initial')
    }
  }

  React.useEffect(() => {
    doSetFormStatus()
  })

  return (
    <div
      className="flex flex-col items-center type-wrapper w-full h-full pt-8 "
      id="accountCreate"
    >
      {!_isMobile && (
        <button
          className="absolute text-sm right-0"
          style={{
            transform: 'rotate(90deg)',
            top: '50%',
            fontFamily: 'Nova Stamp Bold',
          }}
          onClickCapture={toggle}
        >
          Sound {playing ? 'on' : 'off'}
        </button>
      )}
      <div
        className="flex flex-col px-8 mt-8"
        style={{ minWidth: '16rem', maxWidth: '48rem' }}
      >
        <h3
          className="text-xl text-bold floating text-center nsb"
          style={{
            textDecoration: 'underline',
            textDecorationColor: '#ffc391',
            fontSize: '1.5rem',
            fontFamily: titleFont,
          }}
        >
          {title}
        </h3>
        <p className="text-sm text-center" style={{ fontFamily: contentFont }}>
          {content}
        </p>
        <div className="input-container w-full px-16 ">
          <FancyTextInput
            font={titleFont}
            name="name"
            label="Name?"
            onChange={(e) => {
              if (error) {
                setError(false)
              }
              setName(e.target.value)
              // doSetFormStatus()
            }}
          />
          <FancyTextInput
            font={titleFont}
            name="email"
            label="Email?"
            onChange={(e) => {
              if (error) {
                setError(false)
              }
              setEmail(e.target.value)
              // doSetFormStatus(e.target.value)
            }}
          />
          <FancyPhoneInput
            font={titleFont}
            name="phoneNumber"
            label="Phone?"
            // secondaryLabel='I consent to re'
            onChange={(v) => {
              if (error) {
                setError(false)
              }
              setPhone(v)
              // doSetFormStatus()
            }}
          />
          <Checkbox
            label={consent}
            onChange={(e) => {
              setAgree(e.target.checked)
              // doSetFormStatus()
            }}
            checked={agree}
          />
        </div>
      </div>
      <div className="flex flex-col items-center p-8 pt-4">
        <ConfirmButton
          onClick={handleSubmit}
          disabled={formStatus === 'success' || formStatus === 'initial'}
        >
          {' '}
          <span> {formStatus === 'loading' && <LoadingDots />}</span>
          <span>
            {(formStatus === 'initial' || formStatus === 'ready') &&
              'BECOME A MEMBER'}
          </span>
          <span>
            {formStatus === 'success' &&
              'Thank you for joining! We will be in touch'}
          </span>
        </ConfirmButton>

        <a
          onClick={decline}
          className="mt-4 text-sm inline-flex items-center"
          style={{
            fontFamily: 'InputMono',
            position: 'relative',
            height: '1rem',
            cursor: 'pointer',
          }}
        >
          <span>{declineButtonLabel}</span>{' '}
          <ArrowLeft height="1rem" orientation="right" />
        </a>
        <p
          className="mt-20 uppercase text-left"
          style={{
            fontSize: '0.8rem',
            fontWeight: 'bold',
            fontFamily: secondaryContentFont,
            maxWidth: '50rem',
          }}
        >
          {secondaryContent}
        </p>
        <p
          style={{
            bottom: 0,
            position: 'absolute',
            alignSelf: 'center',
            fontSize: '0.5rem',
            fontFamily: finePrintFont,
          }}
          className="text-center"
        >
          {finePrint}
        </p>
      </div>
    </div>
  )
}

export default Signup
