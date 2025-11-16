'use client'

import { useEffect } from 'react'

export default function AutoSubmit({ formId = 'PayFast_payment_form' }: { formId?: string }) {
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (form) {
      form.submit()
    }
  }, [formId])

  return null
}