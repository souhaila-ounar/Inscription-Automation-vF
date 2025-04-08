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
