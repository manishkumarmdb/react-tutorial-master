// build the CommentBox component.
// simple way
/**
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox. -> using simple way
      </div>
    );
  }
}); */


// ----------------------------------

//using JSX Syntax.
var CommentBox2 = React.createClass({displayName: 'CommentBox',
  render: function() {
    return (
      React.createElement('div', {className: "commentBox2"},
        "Hello, world! I am a CommentBox. -> using JSX syntax"
      )
    );
  }
});


// ----------------------------------

// Composing components, build skeletons for CommentList and CommentForm
/**
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
      </div>
    );
  }
}); */


/**
var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
}); */


// Adding new comments
// modify CommentForm function
var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },

  render: function() {
    return (
      <form className="commentForm">
	<input
	  type="text"
	  placeholder="Your name"
	  value={this.state.author}
	  onChange={this.handleAuthorChange}
	/> &nbsp;
	<input
	  type="text"
	  placeholder="Say something..."
	  value={this.state.text}
	  onChange={this.handleTextChange}
	/> &nbsp;
	<input type="submit" value="Post" />
      </form>
    );
   }
});



var CommentBox2 = React.createClass({
  render: function() {
    return (
      <div className="commentBox2">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

// -----------------------------------
/*
// using props modify CommnetList function
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Jordan Walke">This is *another* comment</Comment>
      </div>
    );
  }
}); */

/**
var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {marked(this.props.children.toString())}
      </div>
    );
  }
}); */

// ---------------------------------------------

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
	return { __html: rawMarkup };
       },

	render: function() {
	  return (
	    <div className="comment">
		<h2 className="commentAuthor">
		  {this.props.author}
		</h2>
		<span dangerouslySetInnerHTML={this.rawMarkup()} />
	    </div>
	 );
	}
});

// hook up the data model
var data = [
	{id: 1, author: "Manish Kumar", text: "This is one comment"},
	{id: 2, author: "Nishant Yadav", text: "This is *another* comment"}
];

// modify CommentList function and render the comments dynamically:
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

/**
// modify CommentBox function
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
	<CommentList data={this.props.data} />
	<CommentForm />
      </div>
    );
   }
}); */

/**
// add an array of comment data to the CommentBox
// getInitialState() executes exactly once during the lifecycle
// of the component and sets up the initial state of the component.
var CommentBox = createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div className="commentBox">
	<h1>Comments</h1>
	  <CommentList data={this.state.data} />
	  <CommentForm />
       </div>
     );
   }
}); */

/**
// updating state
var CommentBox = createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
	this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
	<h1>Comments</h1>
	<CommentList data={this.state.data} />
	<CommentForm />
      </div>
    );
  }
}); */

/**
// rendering the function
ReactDOM.render(
  <CommentBox url="/api/comments" />,
  document.getElementById('content')
); */

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // passing a new callback
  handleCommentSubmit: function(comment) {

    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    // submit to the server and refresh the list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
	this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
	this.setStatus({data: comments});
	console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);








