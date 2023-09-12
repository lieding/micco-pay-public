function NeutralEmoji(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" {...props}>
      <path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M82.5 49.999c0 17.95-14.552 32.501-32.498 32.501-17.95 0-32.502-14.552-32.502-32.501 0-17.95 14.552-32.499 32.502-32.499C67.948 17.5 82.5 32.049 82.5 49.999z"></path>
      <circle cx="37.501" cy="39.997" r="5.001" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></circle>
      <circle cx="62.501" cy="39.997" r="5" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></circle>
      <path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M35.001 59.997h30-30z"></path>
    </svg> 
  );
}

export default NeutralEmoji;