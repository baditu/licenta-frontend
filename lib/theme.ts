import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const activeLabelStyles = {
  color: "black",
  bgColor: "transparent",
  transform: "scale(1) translateY(-36px)",
};

const theme = extendTheme({
  ...config,
  ...{
    fonts: {
      heading: "cursive",
      body: "cursive",
    },
    components: {
      Button: {
        variants: {
          blackVariant: {
            bg: "black",
            textColor: "#F6D13A",
          },
        },
      },
      Input: {
        variants: {
          primary: {
            textColor: "#F6D13A",
          },
        },
      },
      Checkbox: {
        variants: {
          filterMenu: {
            control: {
              borderColor: "black",
              _checked: {
                bg: "black",
                borderColor: "black",
                color: "black",
              },
            },
            label: {
              marginLeft: "0.5rem",
              color: "black",
            },
            icon: {
              color: "white",
              borderColor: "black",
            },
            _checked: {
              bg: "black",
              borderColor: "white",
              color: "black",
            },
          },
        },
      },
      Form: {
        variants: {
          floating: {
            container: {
              _focusWithin: {
                bgColor: "transparent",
                borderColor: "black",
                color: "black",
                label: {
                  ...activeLabelStyles,
                },
              },
              "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                {
                  ...activeLabelStyles,
                },
              label: {
                top: 0,
                left: 0,
                zIndex: 2,
                position: "absolute",
                color: "black",
                backgroundColor: "transparent",
                pointerEvents: "none",
                mx: 3,
                px: 1,
                my: 2,
                transformOrigin: "left top",
              },
            },
          },
        },
      },
    },
  },
});

export default theme;
