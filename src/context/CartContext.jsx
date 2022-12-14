import React, { Component } from "react";

const CartContext = React.createContext();

export default CartContext;

export class CartProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsInCart: [],
      backgroundColor: 1,
    };
    this.addToCart = this.addToCart.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.changeBackgorundColor = this.changeBackgorundColor.bind(this);
  }

  async addToCart({ product, attributes, quantity, id }) {
    // destructuring the event trigger data
    const { name, brand, prices, gallery } = product;
    // save the original atributes lenght in order to to prohibit the user from adding a product without choosing its attributes
    const originalAttributes = product.attributes
    // save the needed data in an object
    let data = { name, brand, prices, gallery, attributes, originalAttributes, quantity, id };
    // restrict the user to forget an attribute
    if (attributes.length === originalAttributes.length) {
      // restrict to add the same product to the cart and alert the user
      let alreadyIn = this.state.productsInCart.find((p) => p.id === id);
      if (alreadyIn === undefined) {
        // if all filter pass add the product to the cart
        await this.setState({
          productsInCart: [...this.state.productsInCart, data],
        });
      } else {
        alert(
          "Product already in cart! If you want to modified the quantity you can do it in the cart"
        );
      }
    } else {
      alert("You must select all attributes");
    }
  }

  async addQuantity(e) {
    //  read trigger product id
    const productId = e;
    //  search by id this especific product inside the products in cart
    let currentProduct = this.state.productsInCart.find((evt) => {
      return evt.id === productId;
    });
    // get me the product position in the array of products in cart
    let currentProductIndex = this.state.productsInCart.findIndex((evt) => {
      return evt.id === productId;
    });
    //  add one more quantity to this product
    let currentQuantity = currentProduct.quantity;
    currentProduct.quantity = currentQuantity + 1;
    // update the state with the new quantity
    this.state.productsInCart.splice(currentProductIndex, 1, currentProduct);
    // save changes
    await this.setState({
      productsInCart: this.state.productsInCart,
    });
  }

  async removeFromCart(e) {
    //  read trigger product id
    const productId = e;
    //  search by id the especific product inside the state products in cart
    let currentProduct = this.state.productsInCart.find((evt) => {
      return evt.id === productId;
    });
    // get me the product position in the array of products in cart
    let currentProductIndex = this.state.productsInCart.findIndex((evt) => {
      return evt.id === productId;
    });
    // return me all the products in cart excepted the one i am changing
    let previusProducts = this.state.productsInCart.filter((evt) => {
      return evt.id !== productId;
    });
    //  conditional if current quantity is bigger than one subtract one unit, and if it is equal to one delete it
    if (currentProduct.quantity > 1) {
      currentProduct.quantity--;
      // update the state with the new quantity
      this.state.productsInCart.splice(currentProductIndex, 1, currentProduct);
      // save changes
      await this.setState({
        productsInCart: this.state.productsInCart,
      });
    } else {
      await this.setState({ productsInCart: previusProducts });
    }
  }

  changeBackgorundColor() {
    let currentOpacity = this.state.backgroundColor;
    if (currentOpacity === 0.2) {
      this.setState({ backgroundColor: 1 });
    }
    if (currentOpacity === 1) {
      this.setState({ backgroundColor: 0.2 });
    }
  }

  render() {
    let productsInCart = this.state.productsInCart;
    let backgroundColor = this.state.backgroundColor;
    let addToCart = this.addToCart;
    let addQuantity = this.addQuantity;
    let removeFromCart = this.removeFromCart;
    let changeBackgorundColor = this.changeBackgorundColor;

    return (
      <CartContext.Provider
        value={{
          productsInCart,
          backgroundColor,
          addToCart,
          addQuantity,
          removeFromCart,
          changeBackgorundColor,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
