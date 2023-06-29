import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
      /* latin */
       @font-face {
        font-family: 'Open Sans';
        src: url('/fonts/Treasuremap.ttf') format('truetype');
       }
        `}
  />
);

export default Fonts;
