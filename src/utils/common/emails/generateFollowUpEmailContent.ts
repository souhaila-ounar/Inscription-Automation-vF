const signature = `<div>
  <span style="color: #555555; font-size: 17px"
    ><strong>L'équipe Tutorax</strong></span
  >
</div>
<div>&nbsp;</div>
<div>
  <img
    src="https://tutorcruncher-public.s3.amazonaws.com/tutorax/Tutorax-logo-grey.png"
    alt=""
    width="208"
    height="41"
  />
</div>
<div>&nbsp;</div>
<div>
  <span style="font-size: 14px"
    ><span style="font-size: 14px">Tutorax Inc.</span></span
  >
</div>
<div>
  <span style="font-size: 12px"
    >4969 Rue Ambroise-Lafortune, Boisbriand, QC J7H 0A4</span
  >
</div>
<div>
  <span style="font-size: 12px">Tel. : 1(800) 513-5358 | (514) 548-3242 </span>
</div>
<div>
  <span style="font-size: 13px"
    ><a href="http://www.tutorax.com/">www.tutorax.com</a></span
  >
</div>
`;

export function generateFollowUpEmailContent({
  step,
  clientLastName,
  title,
}: {
  step: number;
  clientLastName: string;
  title: string;
}) {
  const email: Record<number, string[]> = {
    1: [
      `<p>Bonjour ${title} ${clientLastName},</p>
<p>
  Je tenais à vous faire un suivi concernant la demande d’un tuteur en
  présentiel que vous avez fait il y a 5 jours. Sachez que nous avons déjà
  contacté tous les tuteurs à proximité de votre secteur, et nous restons en
  attente de quelques réponses. Je vous rassure : notre équipe fait tout son
  possible pour vous trouver la personne idéale dans les meilleurs délais!
</p>
<p>
  Cependant, étant donné certaines contraintes hors de notre contrôle, il est
  difficile de garantir la disponibilité rapide d'un tuteur en présentiel. Pour
  accélérer le processus et vous offrir plus de choix, je vous propose de
  considérer l'option des cours en ligne. En retirant la contrainte de
  déplacement, cela permettrait d'accéder à un plus large éventail de tuteurs
  qualifiés et disponibles.
</p>
<p>
  Notre plateforme est spécialisée dans la réalisation de séances de tutorat en
  ligne afin d’offrir des cours de grande qualité. Vous pouvez la découvrir
  <a
    style="color: #013255; font-size: 1.2rem"
    href="https://vimeo.com/465000083"
    >ici</a
  >. Cette alternative pourrait non seulement réduire les délais, mais aussi
  vous garantir un service plus flexible et adapté à vos besoins. Le tarif des
  séances en ligne est également un peu plus bas.
</p>
<p>
  Je reste à votre disposition pour discuter de cette option et répondre à
  toutes vos questions. Merci de m'indiquer si vous souhaitez que nous
  modifiions votre demande pour un tuteur en ligne.
</p>
<p>Je vous remercie de votre confiance et de votre patience.</p>
${signature}
`,
    ],
    3: [
      `<p>Bonjour ${title} ${clientLastName},</p>
<p>
  Je reviens vers vous pour faire un suivi concernant la demande de tuteur en
  présentiel que vous avez effectuée il y a un peu plus d’une semaine. Malgré
  tous nos efforts pour trouver un tuteur disponible dans votre secteur, nous
  n'avons malheureusement pas encore réussi à trouver un tuteur qui correspond à
  vos besoins.
</p>
<p>
  Pour vous permettre de commencer les séances le plus rapidement possible,
  j’aimerais vous <strong>offrir une heure gratuite</strong> avec un tuteur en ligne. Cette
  première heure ne vous engage à rien, et vous pourriez ainsi évaluer si les
  séances en ligne conviennent à vos attentes.
</p>
<p>
  Je comprends que l'apprentissage en ligne n'était peut-être pas votre premier
  choix, mais il s'agit d'une solution qui vous permettrait d’avoir accès à un
  très grand éventail de tuteurs qualifiés qui ne peuvent malheureusement pas
  vous aider présentement en raison de la contrainte du déplacement.
</p>

<p>
  Si toutefois vous préférez ne pas opter pour cette alternative, je comprends
  tout à fait. Je préfère toutefois vous informer, qu’en toute transparence, nos
  chances de trouver un tuteur en présentiel commencent à être très limitées à
  ce stade étant donné que nous avons déjà contacté tous nos tuteurs à
  proximité.
</p>

<p>
  Je reste à votre écoute pour toute question ou précision. Merci de bien
  vouloir me faire part de votre décision.
</p>

<p>
  Je vous remercie de votre compréhension et de la confiance que vous nous
  accordez.
</p>
${signature}
`,
    ],
    4: [
      `<p>Bonjour ${title} ${clientLastName},</p>
<p>
  Nous avons fait tout notre possible ces 21 derniers jours pour trouver un
  tuteur en présentiel qui corresponde à vos besoins, mais, malheureusement,
  malgré nos nombreux efforts et recherches, nous n'avons pas réussi à trouver
  un tuteur disponible dans votre secteur.
</p>

<p>
  Pour ne pas laisser cette situation sans solution, j’aimerais vous offrir 2
  heures gratuites avec un tuteur en ligne. Ces séances vous permettent de
  tester notre plateforme en ligne sans engagement et d’obtenir un soutien
  académique. Si cette option ne vous convient pas, je comprendrai tout à fait,
  et nous pourrons alors fermer votre demande actuelle.
</p>

<p>
  Je reste à votre disposition pour toute question ou précision, et j'attends
  votre retour pour savoir quelle option vous conviendrait le mieux.
</p>

<p>Merci encore pour votre patience et votre compréhension.</p>
<p>Cordialement,</p>
${signature}
`,
    ],
  };

  const contenu = email[step].map((p) => `<p>${p}</p>`).join("\n");

  return contenu;
}

export function generateEmailToClientManager(jobId: number) {
  return `
<p>Bonjour!</p>
<p>
  Ce courriel est pour vous informer que le client ci-bas doit être appelé afin
  de lui vendre nos services en ligne, car cela fait 8 jours que nous essayons
  de lui trouver un tuteur à domicile.
</p>
<p>
  <strong>Lien du mandat concerné : </strong>
  <a href="https://app.tutorax.com/cal/service/${jobId}/">https://app.tutorax.com/cal/service/${jobId}</a>
</p>
<p><strong> Mode d’inscription : </strong>Assistée.</p>
  `;
}
