import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, price, imageUrl, rating} = productDetails

  return (
    <li className="product_item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="products-image"
      />
      <p className="product-title">{title}</p>
      <p className="product-brand">{`by ${brand}`}</p>
      <div className="price-rating-container">
        <p className="product-price">{`Rs ${price}`}</p>
        <div className="rating-container">
          <p className="product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
