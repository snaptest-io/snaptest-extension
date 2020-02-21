import React from 'react'
import ArchivedTestListItem from './ArchivedTestListItem'

class ArchivedTestList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { tests, directory } = this.props;
    
    return (
      <div className="ArchivedTestList">
        {tests.map((test, idx) => (
          <ArchivedTestListItem test={test} key={idx} directory={directory} />
        ))}
      </div>
    )
  }

}

export default ArchivedTestList;
