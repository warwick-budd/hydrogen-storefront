import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import styles from './styles/app.css';
import favicon from '../public/favicon.svg';

export const links = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

const CART_QUERY = `#graphql
  query ($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
              amountPerQuantity {
                amount
                currencyCode
              }
              compareAtAmountPerQuantity {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                availableForSale
                compareAtPrice {
                  ...MoneyFragment
                }
                price {
                  ...MoneyFragment
                }
                requiresShipping
                title
                image {
                  ...ImageFragment
                }
                product {
                  handle
                  title
                  id
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          ...MoneyFragment
        }
        totalAmount {
          ...MoneyFragment
        }
        totalDutyAmount {
          ...MoneyFragment
        }
        totalTaxAmount {
          ...MoneyFragment
        }
      }
      note
      attributes {
        key
        value
      }
      discountCodes {
        code
      }
    }
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;


export async function loader({context}) {
  const layout = await context.storefront.query(LAYOUT_QUERY);
  return {layout};
}

export default function App() {
  const data = useLoaderData();

  const {name} = data.layout.shop;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello, {name}</h1>
        <p>This is a custom storefront powered by Hydrogen</p>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;
