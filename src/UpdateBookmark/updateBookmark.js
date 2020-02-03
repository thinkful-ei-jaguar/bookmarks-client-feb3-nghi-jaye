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
    currentBM: this.props.currentBM
  };

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = e.target
    const bookmark = {
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value,
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
              value= {this.state.currentBM.title}
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
              value= {this.state.currentBM.url}
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
              value= {this.state.currentBM.description}
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
              value= {this.state.currentBM.rating}
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
