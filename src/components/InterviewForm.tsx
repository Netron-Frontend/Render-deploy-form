import { useCallback, useMemo, useState } from 'react'
import { getSupabase } from '../lib/supabaseClient'

type FormState = {
  first_name: string
  last_name: string
  email: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialState: FormState = {
  first_name: '',
  last_name: '',
  email: '',
}

export function InterviewForm() {
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const emailRegex = useMemo(
    () => /^(?:[a-zA-Z0-9_'^&\/+\-])+(?:\.(?:[a-zA-Z0-9_'^&\/+\-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/,
    []
  )

  const validate = useCallback((data: FormState): FormErrors => {
    const nextErrors: FormErrors = {}
    if (!data.first_name.trim()) nextErrors.first_name = 'Введите имя'
    if (!data.last_name.trim()) nextErrors.last_name = 'Введите фамилию'
    if (!data.email.trim()) nextErrors.email = 'Введите email'
    else if (!emailRegex.test(data.email.trim())) nextErrors.email = 'Некорректный email'
    return nextErrors
  }, [emailRegex])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: undefined }))
      setSuccess(null)
      setSubmitError(null)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSuccess(null)
      setSubmitError(null)
      const nextErrors = validate(values)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) return

      setIsSubmitting(true)
      try {
        const supabase = getSupabase()
        const { error } = await supabase
          .from('interview_applicants')
          .insert([
            {
              first_name: values.first_name.trim(),
              last_name: values.last_name.trim(),
              email: values.email.trim(),
            },
          ])

        if (error) throw error

        setValues(initialState)
        setSuccess('Данные успешно отправлены!')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Не удалось отправить данные'
        setSubmitError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [validate, values]
  )

  return (
    <form className="vc-form" onSubmit={handleSubmit} noValidate>
      <div className="vc-field">
        <label htmlFor="first_name" className="vc-label">Имя</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          className={`vc-input ${errors.first_name ? 'vc-input-error' : ''}`}
          placeholder="Иван"
          value={values.first_name}
          onChange={handleChange}
          required
        />
        {errors.first_name && <div className="vc-error" role="alert">{errors.first_name}</div>}
      </div>

      <div className="vc-field">
        <label htmlFor="last_name" className="vc-label">Фамилия</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          className={`vc-input ${errors.last_name ? 'vc-input-error' : ''}`}
          placeholder="Петров"
          value={values.last_name}
          onChange={handleChange}
          required
        />
        {errors.last_name && <div className="vc-error" role="alert">{errors.last_name}</div>}
      </div>

      <div className="vc-field">
        <label htmlFor="email" className="vc-label">Почта</label>
        <input
          id="email"
          name="email"
          type="email"
          className={`vc-input ${errors.email ? 'vc-input-error' : ''}`}
          placeholder="ivan.petrov@example.com"
          value={values.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="vc-error" role="alert">{errors.email}</div>}
      </div>

      {submitError && <div className="vc-alert vc-alert-error" role="alert">{submitError}</div>}
      {success && <div className="vc-alert vc-alert-success" role="status">{success}</div>}

      <button className="vc-button" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  )
}


