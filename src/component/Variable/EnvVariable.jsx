import React from 'react'
import _ from 'lodash'
import Variable from "./Variable";
import {Icon} from '../'

class EnvVariable extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { environments = [],
      variable = {},
      onValueChange = _.noop,
      onDelete = _.noop,
      deleteDisabled = false,
      editDisabled = false,
      nestedDepth = 0,
      ignoreEnvs = [],
      prefix = ""
    } = this.props;

    const selectedEnv = _.find(environments, {id: variable.defaultValue});

    return (
      <div className="EnvVariable">
        {!editDisabled ? (
          <div className="grid-row v-align">
            <div className="env-select">
              <select value={variable.defaultValue} onChange={(e) => onValueChange(e.currentTarget.value)}>
                <option default >Select...</option>
                {(environments.filter((env) => ignoreEnvs.indexOf(env.id) === -1).map((envOption, idx) => (
                  <option value={envOption.id} key={idx}>{prefix}{envOption.name}</option>
                )))}
              </select>
            </div>
            {!deleteDisabled && (
              <div onClick={() => onDelete(variable.id)}>
                <Icon classNames="remove-btn" name="remove" />
              </div>
            )}
          </div>
        ) : (
          <div className="env-select-placeholder">
            {prefix}{selectedEnv ? selectedEnv.name : "None Selected"}
          </div>
       )}
       {(selectedEnv && nestedDepth < 2 && selectedEnv.variables.length > 0) && (
          <div className="envvar-variables">
            {selectedEnv.variables.map((envVar, idx) => (
              envVar.type === "STRING_VAR" ?
                  <div className="var-cont">
                    <Variable name={envVar.name}
                              value={envVar.defaultValue}
                              editDisabled={true}
                              deleteDisabled={true}/>
                  </div>
                : envVar.type === "ENV_VAR" ?
                  <div className="var-cont">
                    <EnvVariable variable={envVar}
                                 environments={environments}
                                 editDisabled={true}
                                 deleteDisabled={true}
                                 nestedDepth={nestedDepth + 1}/>
                  </div>
                : null
            ))}
          </div>
        )}
      </div>
    )
  }

}

export default EnvVariable;
