import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MovieList from './MovieList';
import CustomerList from './CustomerList';
import Search from './Search';
import axios from 'axios';




class VideoStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCustomer: "none",
      selectedMovie: "none"
    };
  }

  findMovie =(movie) => {
    const movieSelectedState = {}
    movieSelectedState["selectedMovie"] = movie
    this.setState(movieSelectedState)
    console.log(this.state);
  }

  resetState = () => {
    this.setState({
      selectedCustomer: '',
      selectedMovie: '',
    });
  }

  findCustomer =(customer) => {
    const customerSelectedState = {}
    customerSelectedState["selectedCustomer"] = customer
    this.setState(customerSelectedState)
    console.log(customer);
    console.log(this.state);
  }

  checkOutRental  =() => {
    let today = new Date();
    today.setDate(today.getDate() + 7)
    const apiPayload = {
      title: this.state.selectedMovie.title,
      customer_id: this.state.selectedCustomer.id,
      due_date: today
    }
    console.log(apiPayload);
    if (this.state.selectedCustomer !== "none" && this.state.selectedMovie !== "none") {
      axios.post(`http://localhost:3000/rentals/${this.state.selectedMovie.title}/check-out`, apiPayload)
      .then((response) => {
        console.log(response);
        this.resetState();
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message
        })
      });
    }
  }

  checkInRental  =() => {
    const apiPayload = {
      title: this.state.selectedMovie.title,
      customer_id: this.state.selectedCustomer.id,
    }
    console.log(apiPayload);
    if (this.state.selectedCustomer !== "none" && this.state.selectedMovie !== "none") {
      axios.post(`http://localhost:3000/rentals/${this.state.selectedMovie.title}/return`, apiPayload)
      .then((response) => {
        console.log(response);
        this.resetState();
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message
        })
      });
    }
    console.log(this.state.errorMessage);
  }

  // overdueMovies  =() => {
  //
  //   axios.get("http://localhost:3000/rentals/overdue")
  //   .then((response) => {
  //     console.log(response)
  //   })
  //   .catch((error) => {
  //     this.setState({
  //       errorMessage: error.message
  //     })
  //   });
  // }
  //      <Route path="/movies" render={(props) => <MovieListShow {...this.findMovie}/>}/>
  //      <Route path="/movies" component={() => <MovieListShow findMovief={this.findMovie}  />}/>


  render() {
    return (
      <Router>
      <div>
      <ul>
      <li>
      <Link to="/">Home</Link>
      </li>
      <li>
      <Link to="/movies">Movies</Link>
      </li>
      <li>
      <Link to="/customers">Customers</Link>
      </li>
      <li>
      <Link to="/search">Search</Link>
      </li>
      <li>
      <Link to="/overdue">Overdue</Link>
      </li>
      </ul>


      <div>{this.state.selectedCustomer === "none" ? this.state.selectedCustomer
       : this.state.selectedCustomer.name}</div>
      <div>{this.state.selectedMovie === "none" ? this.state.selectedMovie : this.state.selectedMovie.title}</div>
      <button
      onClick ={this.checkOutRental}
      type="button">Check Out New Rental</button>
      <button
      onClick ={this.checkInRental}
      type="button">Check In Movie</button>
      <hr />

      <Route exact path="/" component={Home} />

      <Route path="/movies" render={(props) => <MovieListShow {...props} findMovieProp={this.findMovie} />}/>
      <Route path="/customers" render={(props) => <CustomerListShow {...props} findCustomerProp={this.findCustomer} />}/>
      <Route path="/search" component={SearchShow} />
      <Route path="/overdue" component={OverdueShow} />

      </div>
      </Router>)
    }
  }

  function Home() {
    return (
      <div>
      <h2>Home</h2>
      </div>
    );
  }


  function OverdueShow() {
    return (
      <div>
      <h2>Overdue Movies</h2>
      <MovieList URL={"http://localhost:3000/rentals/overdue"}/>
      </div>
    );
  }

  function SearchShow() {
    return (
      <div>
      <Search/>
      </div>
    );
  }

  function MovieListShow(props) {

    return (
      <section>
      <MovieList selectMovieCallback={props.findMovieProp} URL = {"http://localhost:3000/movies"}/>
      </section>
    );
  }

  function CustomerListShow(props) {
    return (
      <div>
      <CustomerList selectCustomerCallback={props.findCustomerProp}/>
      </div>
    );
  }

  export default VideoStore;
