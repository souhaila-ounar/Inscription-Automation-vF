export const smsTemplates = {
  WITH_RDV: {
    francais: `Bonjour {{title}} {{lastName}},
  
  Je suis {{firstName}}, {{role}} chez Tutorax. Je viens d’essayer de vous appeler comme convenu pour discuter de votre demande d’inscription à notre service de tutorat, mais malheureusement je n’ai pas réussi à vous joindre.
  
  Afin de discuter de vos besoins, pourriez-vous s.v.p. m’indiquer le meilleur moment pour vous appeler? Vous pouvez aussi prendre un nouveau rdv directement dans mon calendrier en appuyant ici : https://tutorax.com/reservez-un-appel-decouverte/?branch1=tutorat
  
  Au plaisir de vous aider! :)
  
  {{firstName}} de Tutorax`,

    anglais: `Hello {{title}} {{lastName}},
  
  I'm {{firstName}}, your {{role}} at Tutorax. I just tried to reach you as scheduled to discuss your tutoring request, but unfortunately I wasn't able to get in touch.
  
  To better assist you, could you please let me know the best time to call you? You can also book another time directly in my calendar here: https://tutorax.com/reservez-un-appel-decouverte/?branch1=tutorat
  
  Looking forward to helping you! :)
  
  {{firstName}} from Tutorax`,
  },

  WITHOUT_RDV: {
    francais: `Bonjour {{title}} {{lastName}},
  
  Je suis {{firstName}}, {{role}} chez Tutorax. J’ai tenté de vous appeler à la suite de votre demande d’inscription à notre service de tutorat, mais malheureusement je n’ai pas réussi à vous joindre.
  
  Afin de discuter de vos besoins, pourriez-vous s.v.p. m’indiquer le meilleur moment pour vous appeler? Vous pouvez aussi prendre un rdv directement dans mon calendrier en appuyant ici : https://tutorax.com/reservez-un-appel-decouverte/?branch1=tutorat
  
  Au plaisir de vous aider! :)
  
  {{firstName}} de Tutorax`,

    anglais: `Hello {{title}} {{lastName}},
  
  I'm {{firstName}}, your {{role}} at Tutorax. I tried to call you following your tutoring request, but unfortunately I couldn't reach you.
  
  To better assist you, could you please let me know the best time to call you? You can also book a call directly in my calendar here: https://tutorax.com/reservez-un-appel-decouverte/?branch1=tutorat
  
  Looking forward to helping you! :)
  
  {{firstName}} from Tutorax`,
  },
};
