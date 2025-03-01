import {useMemo} from 'react';
import {gql, useShopQuery, useSession, useShop} from '@shopify/hydrogen';
import {Section} from '~/components/elements';
import {ProductCard} from '~/components/blocks';
import {PRODUCT_CARD_FIELDS} from '~/lib/fragments';

const mockProducts = new Array(12).fill('');

export function ProductSwimlane({
  title = 'Featured Products',
  data = mockProducts,
  count = 12,
  ...props
}) {
  const productCardsMarkup = useMemo(() => {
    // If the data is already provided, there's no need to query it, so we'll just return the data
    if (typeof data === 'object') {
      return <ProductCards products={data} />;
    }

    // If the data provided is a productId, we will query the productRecommendations API.
    // To make sure we have enough products for the swimlane, we'll combine the results with our top selling products.
    if (typeof data === 'string') {
      return <RecommendedProducts productId={data} count={count} />;
    }

    // If no data is provided, we'll go and query the top products
    return <TopProducts count={count} />;
  }, [count, data]);

  return (
    <Section heading={title} padding="y" {...props}>
      <div className="grid grid-flow-col gap-6 px-4 pb-4 overflow-x-scroll md:pb-8 snap-x scroll-px-4 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
        {productCardsMarkup}
      </div>
    </Section>
  );
}

function ProductCards({products}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          className={'snap-start w-80'}
        />
      ))}
    </>
  );
}

function RecommendedProducts({productId, count}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {data: products} = useShopQuery({
    query: RECOMMENDED_PRODUCTS_QUERY,
    variables: {
      count,
      productId,
      languageCode,
      countryCode,
    },
  });

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return <ProductCards products={mergedProducts} />;
}

function TopProducts({count}) {
  const {
    data: {products},
  } = useShopQuery({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count,
    },
  });

  return <ProductCards products={products.nodes} />;
}

const RECOMMENDED_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query productRecommendations(
    $productId: ID!
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCardFields
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;

const TOP_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FIELDS}
  query topProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;
