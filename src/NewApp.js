import React, { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

const NewApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    brandDescription: '',
    atmosphere: '',
    audience: '',
    references: '',
    expectations: '',
    contact: ''
  });
  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateComment = (currentStep) => {
    switch (currentStep) {
      case 1:
        return `Отлично, «${formData.brandName}» звучит интересно! Давайте подумаем, какие ощущения и ассоциации вы хотите создать.`;
      case 2:
        return `Спасибо за атмосферу: «${formData.atmosphere}». Это поможет задать настроение. Теперь расскажите о вашей аудитории и позиционировании.`;
      case 3:
        return `Понял вашу аудиторию: «${formData.audience}». Это поможет нам выделиться. Какие референсы вам нравятся или не нравятся?`;
      case 4:
        return `Референсы отмечены: «${formData.references}». Осталось обсудить ожидания от результата и контакты.`;
      case 5:
        return `Спасибо за ожидания. Сейчас сформируем итоговую сводку и рекомендации.`;
      default:
        return '';
    }
  };

  const nextStep = () => {
    setComment(generateComment(step));
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const generateSummary = () => {
    return `Ваш бренд «${formData.brandName}» мы видим как ${formData.brandDescription}. Атмосфера: ${formData.atmosphere}. Аудитория: ${formData.audience}. Референсы: ${formData.references}. Ожидания: ${formData.expectations}. Мы предложим концепт, который отражает эти аспекты и предложим визуальные и сенсорные решения.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = `Новая заявка:\nБренд: ${formData.brandName}\nОписание: ${formData.brandDescription}\nАтмосфера: ${formData.atmosphere}\nАудитория: ${formData.audience}\nРеференсы: ${formData.references}\nОжидания: ${formData.expectations}\nКонтакты: ${formData.contact}`;
    const token = process.env.REACT_APP_TELEGRAM_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;
    if (token && chatId) {
      const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
      try {
        await fetch(url);
      } catch (err) {
        console.error(err);
      }
    }
    setStep(6);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>О бренде</h2>
            <input name="brandName" placeholder="Название бренда" value={formData.brandName} onChange={handleChange} />
            <textarea name="brandDescription" placeholder="Описание и философия бренда" value={formData.brandDescription} onChange={handleChange} />
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 2:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Атмосфера</h2>
            <textarea name="atmosphere" placeholder="Опишите атмосферу: цвета, материалы, запахи, музыку" value={formData.atmosphere} onChange={handleChange} />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 3:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Аудитория и позиционирование</h2>
            <textarea name="audience" placeholder="Опишите вашу целевую аудиторию и позиционирование" value={formData.audience} onChange={handleChange} />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 4:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Референсы и антиреференсы</h2>
            <textarea name="references" placeholder="Ваши референсы и антиреференсы" value={formData.references} onChange={handleChange} />
            <button onClick={prevStep}>Назад</button>
            <button onClick={nextStep}>Далее</button>
          </div>
        );
      case 5:
        return (
          <div>
            {comment && <p className="comment">{comment}</p>}
            <h2>Ожидания и контакты</h2>
            <textarea name="expectations" placeholder="Опишите ваши ожидания от результата" value={formData.expectations} onChange={handleChange} />
            <input name="contact" placeholder="Ваш контакт (Email или Telegram)" value={formData.contact} onChange={handleChange} />
            <button onClick={prevStep}>Назад</button>
            <button onClick={handleSubmit}>Завершить</button>
          </div>
        );
      case 6:
        return (
          <div>
            <h2>Сводка и рекомендации</h2>
            <p>{generateSummary()}</p>
            <p>Спасибо! Ваша заявка принята, и мы скоро с вами свяжемся.</p>
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
};

export default NewApp;
