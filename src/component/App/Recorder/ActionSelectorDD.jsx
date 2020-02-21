import React from 'react'
import _ from 'lodash'
import * as ActionDefs from '../../../generators/_shared/ActionTruth'
import {buildPathString} from '../../../util/TestUtils'

class ActionSelectorDD extends React.Component {

  constructor(props) {
    super(props);
    this.state = {searchResults: [], searchValue:"", selectedCategory: null, revealDetailsFor: null, selectedResult: null}
  }

  componentDidMount() {
    this.refs.search.focus()
  }

  onMouseEnterCategory(category) {

    this.categoryHovered = category;

    this.currentPendingTimer = setTimeout(() => {
      if (this.categoryHovered) {
        this.setState({selectedCategory: this.categoryHovered});
      }
    }, 125);

  }

  onMouseLeaveCategory(category) {
    this.categoryHovered = null;
  }

  render() {

    const { onActionSelected = _.noop, components = [], tests = [], tree } = this.props;
    const { searchResults, searchValue, selectedCategory, revealDetailsFor, selectedResult } = this.state;
    const actionDetails = ActionDefs.ActionsByConstant[revealDetailsFor];

    return (
      <div className="ActionSelectorDD">
        <div className="dropdown-box as-keepopen">
          <div className="grid-row">
            <div>
              <div className="search" onMouseEnter={()=> this.setState({revealDetailsFor: null})}>
                <input type="text"
                       value={searchValue}
                       onChange={(e) => this.onSearchValueChange(e)}
                       placeholder="search..."
                       ref="search"
                       onKeyDown={(e) => this.onKeydown(e)} />
              </div>
              {(searchValue.length > 0 && searchResults.length > 0) ? (
                <div className="search-results">
                  {searchResults.map((result, idx) =>
                    <div className={"result" + (result.disabled ? " disabled" : "") + (selectedResult === result.constant ? " selected" : "")}
                         key={idx}
                         onClick={() => result.disabled ? null : onActionSelected(result.constant)}>{result.category} - {result.name}</div>
                  )}
                </div>
              ) : searchValue.length > 0 ? (
                <div className="search-results">
                  <div className="no-result-title">No results</div>
                  <div className="no-result-suggestion">Try topics like "form", "mouse", "navigation" etc...</div>
                </div>
              ) : (
                <div className="grid-row">
                  <div className="categories" onMouseEnter={()=> this.setState({revealDetailsFor: null})}>
                    {ActionDefs.ActionsByCategory.map((category, idx) =>
                      <div className="category"
                           key={idx}
                           onMouseEnter={() => this.onMouseEnterCategory(category.label)}
                           onMouseLeave={() => this.onMouseLeaveCategory(category.label)}>
                        <div>{category.label}</div>
                      </div>
                    )}
                    <div className="category components"
                         onMouseEnter={() => this.onMouseEnterCategory("Components")}
                         onMouseLeave={() => this.onMouseLeaveCategory("Components")}>
                      <div>Components</div>
                    </div>
                    {/*<div className="category components"*/}
                         {/*onMouseEnter={() => this.onMouseEnterCategory("Requests")}*/}
                         {/*onMouseLeave={() => this.onMouseLeaveCategory("Requests")}>*/}
                      {/*<div>Requests</div>*/}
                    {/*</div>*/}
                  </div>
                  {selectedCategory === "Components" ? (
                    <div className="components">
                      {components.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).map((component) => (
                        <div className="component" onClick={() => onActionSelected("COMPONENT", component.id)}>
                          <div className="name">{component.name}</div>
                          <div className="path">{buildPathString(component, tree)}</div>
                        </div>
                      ))}
                    </div>
                  ) : selectedCategory === "Requests" ? (
                    <div className="components">
                      {tests.filter((test) => test.type === "request").map((request) => (
                        <div className="component" onClick={() => onActionSelected("REQUEST", request.id)}>
                          <div className="name">{request.name}</div>
                          <div className="path">{request.method}: {request.url}</div>
                          <div className="path">{buildPathString(request, tree)}</div>
                        </div>
                      ))}
                    </div>
                  ) : selectedCategory ? (
                    <div className="actions">
                      {ActionDefs.ActionsByCategoryMap[selectedCategory].actions.map((act, idx) =>
                        <div className={"action" + (act.disabled ? " disabled" : "")}
                             key={idx}
                             onMouseEnter={()=> this.setState({revealDetailsFor: act.constant}) }
                             onClick={() => act.disabled ? null : onActionSelected(act.constant)}>{act.name}</div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            {(false && revealDetailsFor) && (
              <div className="action-details">
                <div className="ad-header">{actionDetails.name}</div>
                {actionDetails.description && (
                  <div className="ad-description"></div>
                )}
                {actionDetails.params.length > 0 && (
                  <div className="ad-params">
                    {actionDetails.params.map((param, idx) =>
                      <div className="param" key={idx}>{param.name}: {param.description}</div>
                    )}
                  </div>
                )}
                {actionDetails.supportedBy.length > 0 && (
                  <div className="ad-support">
                    {actionDetails.supportedBy.map((support, idx) =>
                      <div key={idx}>{support}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  onKeydown(e) {

    const { selectedResult, searchResults, searchValue } = this.state;
    const { onActionSelected = _.noop} = this.props;


    if (searchResults.length === 0 || searchValue === "") {
      this.setState({ selectedResult: null });
      return;
    }

    var resultsByConstant = searchResults.map((result) => result.constant);

    if (!selectedResult) {
      this.setState({selectedResult: resultsByConstant[0]})
      return;
    }

    var idxOfSelectedResult = resultsByConstant.indexOf(selectedResult);

    if (e.code === "ArrowDown") {
      e.preventDefault();
      if (resultsByConstant[idxOfSelectedResult + 1]) this.setState({selectedResult: resultsByConstant[idxOfSelectedResult + 1]})
      else resultsByConstant[0];
    }
    else if (e.code === "ArrowUp") {
      e.preventDefault();
      if (resultsByConstant[idxOfSelectedResult - 1]) this.setState({selectedResult: resultsByConstant[idxOfSelectedResult - 1]});
      else resultsByConstant[resultsByConstant.length - 1];
    }
    else if (e.code === "Enter") {
      onActionSelected(selectedResult);
    }
  }

  onSearchValueChange(e) {

    var searchValue = e.currentTarget.value;
    var searchResults = this.getSearchResultsByQuery(searchValue);

    this.setState({searchValue, searchResults})

  }

  getSearchResultsByQuery(query) {

    query = query.toLowerCase();

    // ActionDefs.Actions
    return ActionDefs.Actions.filter((action) => {
      if (action.name.toLowerCase().indexOf(query) !== -1) return true;
      if (action.category && action.category.toLowerCase().indexOf(query) !== -1) return true;
      if (action.tags.filter((tag) => tag.toLowerCase().indexOf(query) !== -1).length > 0) return true;
    });

  }

}

export default ActionSelectorDD;
