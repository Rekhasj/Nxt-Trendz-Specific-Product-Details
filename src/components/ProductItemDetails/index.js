import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    quantity: 1,
    similarProductsData: [],
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstant.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onClickIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onClickDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      description,
      availability,
      brand,
      totalReviews,
    } = productData
    return (
      <>
        <div className="productDetails-item-container">
          <div className="image-container">
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div className="details-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="availability-container">
              <p className="availability-label">Available:</p>
              <p className="availability">{availability}</p>
            </div>
            <div className="brand-container">
              <p className="brand-label">brand:</p>
              <p className="brand">{brand}</p>
            </div>
            <hr className="break-line" />
            <div className="count-container">
              <button
                testid="minus"
                className="button"
                type="button"
                onClick={this.onClickDecrement}
              >
                <BsDashSquare className="quantity-icon" />
              </button>
              <p className="count">{quantity}</p>
              <button
                testid="plus"
                className="button"
                type="button"
                onClick={this.onClickIncrement}
              >
                <BsPlusSquare className="quantity-icon" />
              </button>
            </div>
            <button className="add-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProductsData.map(eachProduct => (
            <SimilarProductItem
              productDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loading" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="errorView-image"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="shopping-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderProductDetailsView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="productDetails-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
