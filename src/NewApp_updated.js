import React, { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

function NewApp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: "",
    brandDescription: "",
    atmosphere: "",
    audience: "",
    references: "",
    expectations: "",
    contact: ""
  });
  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to generate AI-like comments based on the current step
  const generateComment = (currentStep) => {
    switch (currentStep) {
      case 1:
        return `Отлично! «${formData.brandName}» звучит интересно. Расскажите, какое впечатление должен производить ваш бренд.`;
      case 2:
        return `Спасибо за описание атмосферы: «${formData.atmosphere}». Теперь опишите вашу аудиторию и позиционирование.`;
      case 3:
        return `Понял вашу аудиторию: «${formData.audience}». Теперь приведите примеры, которые вам нравятся (и не нравятся).`;
      case 4:
        return `Спасибо! Мы учли ваши примеры: «${formData.references}». Осталось обсудить ваши ожидания и контакты.`;
      case 5:
        return `Отлично, осталось совсем немного. После отправки мы пришлём вам сводку и рекомендации.`;
      default:
        return "";
    }
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    setComment(generateComment(step));
    if (step === 5) {
      // Submit on the final form step
      handleSubmit();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const generateSummary = () => {
    return `Ваш бренд «${formData.brandName}» мы видим как ${formData.brandDescription}. Атмосфера: ${formData.atmosphere}. Аудитория: ${formData.audience}. Примеры: ${formData.references}. Ожидания: ${formData.expectations}. Мы предложим концепт, который отражает эти аспекты и предложим визуальные и сенсорные решения.`;
  };

  const handleSubmit = async () => {
    // Compose message for Telegram
    const message = `Бриф от ${formData.brandName}\nОписание бренда: ${formData.brandDescription}\nАтмосфера: ${formData.atmosphere}\nАудитория: ${formData.audience}\nПримеры: ${formData.references}\nОжидания: ${formData.expectations}\nКонтакты: ${formData.contact}`;
    const token = process.env.REACT_APP_TELEGRAM_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      });
    } catch (error) {
      console.error("Ошибка отправки в Telegram", error);
    }
    setStep(6);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>О бренде</h2>
            <input
              name="brandName"
              placeholder="Название бренда"
              value={formData.brandName}
              onChange={handleChange}
            />
            <textarea
              name="brandDescription"
              placeholder="Описание и философия бренда"
              value={formData.brandDescription}
              onChange={handleChange}
            />
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 2:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Атмосфера</h2>
            <textarea
              name="atmosphere"
              placeholder="Опишите атмосферу, цвета, материалы, запахи, музыку"
              value={formData.atmosphere}
              onChange={handleChange}
            />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 3:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Аудитория и позиционирование</h2>
            <textarea
              name="audience"
              placeholder="Опишите целевую аудиторию и позиционирование"
              value={formData.audience}
              onChange={handleChange}
            />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 4:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Примеры, которые вам нравятся (и не нравятся)</h2>
            <textarea
              name="references"
              placeholder="Расскажите, какие бренды, стили или атмосферы вам нравятся, и что категорически не нравится"
              value={formData.references}
              onChange={handleChange}
            />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 5:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Ожидания и контакты</h2>
            <textarea
              name="expectations"
              placeholder="Опишите ваши ожидания"
              value={formData.expectations}
              onChange={handleChange}
            />
            <input
              name="contact"
              placeholder="Email или Telegram"
              value={formData.contact}
              onChange={handleChange}
            />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Завершить</button>
          </div>
        );
      case 6:
        return (
          <div>
            <h2>Сводка и рекомендации</h2>
            <p>{generateSummary()}</p>
            <p>Спасибо! Ваша заявка принята, и мы скоро свяжемся с вами.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <SwitchTransition mode="out-in">
        <CSSTransition key={step} timeout={300} classNames="fade">
          <div>{renderStep()}</div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export default NewApp;
