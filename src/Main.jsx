import React from "react"
import OpenAI from "openai"

export default function Main() {
  const [formData, setFormData] = React.useState({ language: "", text: "" })
  const [isTranslated, setIsTranslated] = React.useState(false)
  const [translatedText, setTranslatedText] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")

  async function translateText() {
    try {
      setIsTranslated((prevV) => !prevV)

      if (isTranslated) {
        setFormData({ language: "", text: "" })
      }

      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      })

      const messages = [
        {
          role: "system",
          content: `You can translate english text to ${formData.language} like an expert.`,
        },
        {
          role: "user",
          content: `${formData.text}`,
        },
      ]

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      })

      setTranslatedText(response.choices[0].message.content)
    } catch (error) {
      setErrorMessage(error.message)
      console.log(errorMessage)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      }
    })
  }
  if (errorMessage != 0) return <h2>{errorMessage}</h2>

  return (
    <div className="main-container">
      <h2 className="main-header">
        {!isTranslated ? "Text to translate👇" : "Original text👇"}
      </h2>
      <textarea
        className="text-to-translate"
        placeholder="How are you?"
        name="text"
        value={formData.text}
        onChange={handleChange}
      ></textarea>
      <h2 className="main-header">
        {!isTranslated ? "Select language👇" : "Your translation👇"}
      </h2>
      {!isTranslated ? (
        <fieldset>
          <label>
            <input
              className="radio-input"
              type="radio"
              name="language"
              value="french"
              id="french"
              onChange={handleChange}
            ></input>
            French <img className="flag" src="/fr-flag.png"></img>
          </label>
          <label>
            <input
              className="radio-input"
              type="radio"
              name="language"
              value="spanish"
              id="spanish"
              onChange={handleChange}
            ></input>
            Spanish
            <img className="flag" src="/sp-flag.png"></img>
          </label>
          <label>
            <input
              className="radio-input"
              type="radio"
              name="language"
              value="japanese"
              id="japanese"
              onChange={handleChange}
            ></input>
            Japanese
            <img className="flag" src="/jpn-flag.png"></img>
          </label>
        </fieldset>
      ) : (
        <textarea
          className="text-to-translate"
          value={translatedText}
          readOnly
        ></textarea>
      )}
      <button
        onClick={formData.text.length >= 2 ? translateText : undefined}
        className="submit-button"
        type="submit"
      >
        {!isTranslated ? "Translate" : "Start Over"}
      </button>
    </div>
  )
}
