import React from 'react'
import _ from 'lodash'
import onClickOutsideHOC from 'react-onclickoutside'

class CollaboratorDropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      focused: false,
      suggestions: [],
      selectedSuggestion: -1
    }

  }

  render() {

    const { email, suggestions, focused, selectedSuggestion } = this.state;
    const { placeholder } = this.props;

    return (
      <div className="CollaboratorDropdown">
        <input type="text"
               ref="theInput"
               value={email}
               placeholder={placeholder}
               className="text-input"
               onChange={(e) => this.onInputChange(e)}
               onFocus={() => this.onFocus()}
               onKeyDown={(e) => this.onKeyDown(e)}/>
        {(focused && suggestions.length > 0) && (
          <div className="suggestions">
            {suggestions.map((suggestion, idx) => (
              <div className={"suggestion" + (selectedSuggestion === idx ? " selected" : "")}
                   key={idx}
                   onClick={(e) => this.onSelectSuggestion(suggestion)}>{suggestion.email}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  handleClickOutside() {
    this.setState({focused: false, selectedSuggestion: -1})
  }

  onFocus() {

    const { collaborators, excludeUsers } = this.props;
    var { suggestions } = this.state;

    this.setState({focused: true});

    if (suggestions.length === 0) {
      suggestions = collaborators.filter((collab) => excludeUsers.indexOf(collab.user_id) === -1);
    }

    this.setState({focused: true, suggestions});
  }

  onKeyDown(e) {

    var { suggestions, selectedSuggestion } = this.state;

    if (e.key === "Escape") {
      this.reset();
    } else if (e.key === "ArrowUp") {
      selectedSuggestion--;
      if (selectedSuggestion < 0) {
        selectedSuggestion = suggestions.length -1;
      }
      this.setState({selectedSuggestion})
    } else if (e.key === "ArrowDown") {
      selectedSuggestion++;
      if (selectedSuggestion > suggestions.length -1) {
        selectedSuggestion = 0;
      }
      this.setState({selectedSuggestion});
    } else if (e.key === "Enter") {
      if (selectedSuggestion > -1) {
        this.onSelectSuggestion(suggestions[selectedSuggestion]);
      }
    }
  }

  onSelectSuggestion(suggestion) {

    const { onSelect = _.noop } = this.props;

    this.setState({ email: "", focused: false }, () => {
      this.refs.theInput.blur();
    });

    onSelect(suggestion);

  }

  reset() {

    const { onSelect = _.noop } = this.props;

    this.setState({email: "", suggestions: [], selectedSuggestion: -1});
    onSelect()
  }

  onInputChange(e) {

    const { collaborators, excludeUsers } = this.props;

    var newValue = e.currentTarget.value;
    var suggestions = [];

    if (newValue === "") {
      suggestions = collaborators.filter((collab) => excludeUsers.indexOf(collab.user_id) === -1);
    } else {
      suggestions = collaborators.filter((collab) => {
        return collab.email.indexOf(newValue) !== -1 && excludeUsers.indexOf(collab.user_id) === -1;
      });
    }

    this.setState({ email: e.currentTarget.value, suggestions });

  }

}

export default onClickOutsideHOC(CollaboratorDropdown);

