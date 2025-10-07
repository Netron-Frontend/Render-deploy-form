import { InterviewForm } from './components/InterviewForm'

export function App() {
  return (
    <div className="vc-page">
      <div className="vc-card">
        <h1 className="vc-title">Анкета перед интервью</h1>
        <p className="vc-subtitle">Заполните, пожалуйста, обязательные поля</p>
        <InterviewForm />
      </div>
    </div>
  )
}


