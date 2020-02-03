import React, { Component } from  'react';
import config from '../config'
import './updateBookmark.css';

const Required = () => (
  <span className='UpdateBookmark__required'>*</span>
)

class UpdateBookmark extends Component {
  static defaultProps = {
    onUpdateBookmark: () => {}
  };

  state = {
    error: null,
    title: this.props.currentBM.title,
    url:this.props.currentBM.url,
    description: this.props.currentBM.description,
    rating: this.props.currentBM.rating
  };

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = this.state
    const bookmark = {
      title,
      url,
      description,
      rating,
    }
    this.setState({ error: null })
    fetch(config.API_ENDPOINT, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        title.value = ''
        url.value = ''
        description.value = ''
        rating.value = ''
        this.props.onUpdateBookmark(data)
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { error } = this.state
    const { onClickCancel } = this.props
    return (
      <section className='UpdateBookmark'>
        <h2>Update a bookmark</h2>
        <form
          className='UpdateBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='UpdateBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value= {this.state.title}
              onChange= {() => this.setState({title: this.target})}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value= {this.state.url}
              onChange= {() => this.setState({url: this.target})}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value= {this.state.description}
              onChange= {() => this.setState({description: this.target})}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value= {this.state.rating}
              onChange= {() => this.setState({rating: this.target})}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='UpdateBookmark__buttons'>
            <button type='button' onClick={onClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default UpdateBookmark;
