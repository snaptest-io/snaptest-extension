import React from 'react'
import _ from 'lodash'
import Message from '../../../util/Message.js'
import ReactTooltip from 'simple-react-tooltip'
import {Dropdown} from "../../index";
import {hasResultFiltersApplied} from '../../../selectors/resultFilterSelectors'
import ResultFilterDateRange from './ResultFilterDateRange'

class ResultFilters extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: make this come from the resultTagMap and resultRunMap
    Message.promise("getRuns");
    Message.promise("getTags");
  }

  render() {

    const { collaborators, resultFilters = {}, tags, loadResults = _.noop, tagIdtoNameMap, resultRunIdToNameMap, resultRunnerIdToEmailMap, contextIdToNameMap, projects, contextType } = this.props;
    const { runnerIds = [], combos = [], runIds = [], projectIds =[], duration = null, timeStart = null, timeEnd = null } = resultFilters;
    const resultFiltersApplied = hasResultFiltersApplied(resultFilters);
    const runFilters = this.getRunsForFilter();

    return (
      <div className="ResultFilters quick-button-dd">
        <div className="rf-header">
          <div className="rf-icon">
            <svg className="svg-icon filter-svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 1H2a1.003 1.003 0 0 0-.71 1.71L7 8.41V18a1.003 1.003 0 0 0 1.71.71l4-4c.18-.18.29-.43.29-.71V8.41l5.71-5.71c.18-.17.29-.42.29-.7 0-.55-.45-1-1-1z"/></svg>
          </div>
          <div className="grid-item rf-title">
            Result Filters
          </div>
          <div className="result-filter-submit grid-row v-align">
            {resultFiltersApplied && (
              <button className="btn btn-secondary" onClick={() => this.onClear()}>
                Clear
              </button>
            )}
            <button className="btn btn-primary" onClick={() => loadResults()}>
              Apply
            </button>
          </div>
        </div>
        <div className="rf-testselector-panel">
          <Dropdown className={"quick-buttons"} button={
            <div data-tip='Test Tags' title="filter by run">
              <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
            </div>
          }>
            <div onClick={(e) => e.stopPropagation()}>
              <div className="dd-header">Filter by RUNS</div>
              {runFilters.map((run, idx) => (
                <div key={idx} className="dd-item" onClick={() => this.onAddFilter("run", run)}>
                  <svg className="svg-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
                  <div className="item-name">{run.name}</div>
                </div>
              ))}
              {runFilters.length === 0 && (
                <div className="dd-empty">
                  <div className="dd-empty-message">No runs created yet.</div>
                </div>
              )}
            </div>
          </Dropdown>
          <Dropdown className={"quick-buttons"} button={
            <div data-tip='Test Tags' title="filter by tag">
              <svg className="svg-icon svg-with-stroke hoverable" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M0 5a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 0 9.588V5zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" /><path d="M11.5 3.5h6M14.5.5v6" stroke-linecap="square"/></g></svg>
            </div>
          }>
            <div onClick={(e) => e.stopPropagation()}>
              <div className="dd-header">Filter by TAGS</div>
              {tags.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).map((tag, idx) => (
                <div key={idx} className="dd-item" onClick={() => this.onAddFilter("tag-combo", tag)}>
                  <svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                  {tag.name}
                </div>
              ))}
              {tags.length === 0 && (
                <div className="dd-empty">
                  <div className="dd-empty-message">No tags created yet.</div>
                </div>
              )}
            </div>
          </Dropdown>
          <div className="rf-selected-filters">
            {runIds.map((runId) => (
              <div className="rf-selected-filter run">
                <svg className="svg-icon filter-type-icon" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10c0-.36-.2-.67-.49-.84l.01-.01-10-6-.01.01A.991.991 0 0 0 5 3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1 .19 0 .36-.07.51-.16l.01.01 10-6-.01-.01c.29-.17.49-.48.49-.84z" id="play_1_"/></svg>
                <div className="filter-name">{resultRunIdToNameMap[runId]}</div>
                <svg className="remove-filter svg-icon" onClick={() => Message.promise("removeResultFilter", {runId: runId})} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 0 0-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71L11.41 10z"/></svg>
              </div>
            ))}
            {combos.map((combo) => (
              <div className="rf-selected-filter combo">
                <div className="combo-tags" >
                  {combo.tags.map((tag, idx) => (
                    <div className="combo-tag" key={idx}>
                      <svg className="svg-icon filter-type-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>
                      <div className="filter-name">{tagIdtoNameMap[tag]}</div>
                      <svg className="remove-filter svg-icon" onClick={() => Message.promise("removeResultFilter", {comboId: combo.id})} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 0 0-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71L11.41 10z"/></svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rf-testqualifier-panel">
          <div className="rf-selected-filters">
            <div className="rf-selector"  title="filter by date" onClick={() => Message.promise("applyTimeFilter", {value: !resultFilters.applyTimeFilter})}>
              <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path d="M15 5c.6 0 1-.4 1-1V2c0-.5-.4-1-1-1s-1 .5-1 1v2c0 .6.4 1 1 1zM5 5c.6 0 1-.4 1-1V2c0-.5-.4-1-1-1s-1 .5-1 1v2c0 .6.4 1 1 1zm13-2h-1v1c0 1.1-.9 2-2 2s-2-.9-2-2V3H7v1c0 1.1-.9 2-2 2s-2-.9-2-2V3H2c-.5 0-1 .5-1 1v14c0 .5.5 1 1 1h16c.5 0 1-.5 1-1V4c0-.5-.5-1-1-1zM7 17H3v-4h4v4zm0-5H3V8h4v4zm5 5H8v-4h4v4zm0-5H8V8h4v4zm5 5h-4v-4h4v4zm0-5h-4V8h4v4z" fill-rule="nonzero"/></svg>
            </div>
            {resultFilters.applyTimeFilter && (
              <div className="rf-selected-filter date">
                <ResultFilterDateRange resultFilters={resultFilters}/>
                <svg className="remove-filter svg-icon" onClick={() => Message.promise("applyTimeFilter", {value: false})} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 0 0-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71L11.41 10z"/></svg>
              </div>
            )}
            {contextType === "org" && (
              <Dropdown className={"quick-buttons"} button={
                <div className="rf-selector" title="filter by project">
                  <svg className="svg-icon hoverable" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                </div>
              }>
                <div onClick={(e) => e.stopPropagation()}>
                  <div className="dd-header">Filter by PROJECT</div>
                  {projects.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).filter((p) => !p.archived).map((project, idx) => (
                    <div key={idx} className="dd-item" onClick={() => this.onAddFilter("project", project)}>
                      <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                      {project.name}
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="dd-empty">
                      <div className="dd-empty-message">No projects created yet.</div>
                    </div>
                  )}
                </div>
              </Dropdown>
            )}
            {projectIds.map((projectId) => (
              <div className="rf-selected-filter run">
                <svg className="svg-icon filter-type-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                <div className="filter-name">{contextIdToNameMap["project" + projectId]}</div>
                <svg className="remove-filter svg-icon" onClick={() => Message.promise("removeResultFilter", {projectId: projectId})} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 0 0-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71L11.41 10z"/></svg>
              </div>
            ))}
            {(contextType === "org" || contextType === "project") && (
              <Dropdown className={"quick-buttons"} button={
                <div className="rf-selector" title="filter by runner">
                  <svg className="svg-icon hoverable" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10h-2c-.23 0-.42-.09-.59-.21l-.01.01-1.69-1.27-.63 3.14 2.62 2.62c.19.18.3.43.3.71v4c0 .55-.45 1-1 1s-1-.45-1-1v-3.59L9.39 12.8l-2.45 6.55h-.01c-.14.38-.5.65-.93.65-.55 0-1-.45-1-1 0-.12.03-.24.07-.35h-.01L9.43 7h-2.9l-1.7 2.55-.01-.01c-.18.27-.47.46-.82.46-.55 0-1-.45-1-1 0-.21.08-.39.18-.54l-.01-.01 2-3 .02.01C5.36 5.19 5.65 5 6 5h4.18l.36-.96c-.33-.43-.54-.96-.54-1.54a2.5 2.5 0 0 1 5 0A2.5 2.5 0 0 1 12.5 5c-.06 0-.12-.01-.18-.02l-.44 1.18L14.33 8H16c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
                </div>
              }>
                <div onClick={(e) => e.stopPropagation()}>
                  <div className="dd-header">Filter by Runner</div>
                  {collaborators.map((collab, idx) => (
                    <div key={idx} className="dd-item" onClick={() => this.onAddFilter("runner", collab)}>
                      <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                      {collab.email}
                    </div>
                  ))}
                  {collaborators.length === 0 && (
                    <div className="dd-empty">
                      <div className="dd-empty-message">No collaborators yet.</div>
                    </div>
                  )}
                </div>
              </Dropdown>
            )}
            {runnerIds.map((runnerId) => (
              <div className="rf-selected-filter run">
                <svg className="svg-icon filter-type-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.94 17a4.92 4.92 0 0 0-.33-1.06c-.45-.97-1.37-1.52-3.24-2.3-.17-.07-.76-.31-.77-.32-.1-.04-.2-.08-.28-.12.05-.14.04-.29.06-.45 0-.05.01-.11.01-.16-.25-.21-.47-.48-.65-.79.22-.34.41-.71.56-1.12l.04-.11c-.01.02-.01.02-.02.08l.06-.15c.36-.26.6-.67.72-1.13.18-.37.29-.82.25-1.3-.05-.5-.21-.92-.47-1.22-.02-.53-.06-1.11-.12-1.59.38-.17.83-.26 1.24-.26.59 0 1.26.19 1.73.55.46.35.8.85.97 1.4.04.13.07.25.08.38.08.45.13 1.14.13 1.61v.07c.16.07.31.24.35.62.02.29-.09.55-.15.65-.05.26-.2.53-.46.59-.03.12-.07.25-.11.36-.01.01-.01.04-.01.04-.2.53-.51 1-.89 1.34 0 .06 0 .12.01.17.04.41-.11.71 1 1.19 1.1.5 2.77 1.01 3.13 1.79.34.79.2 1.25.2 1.25h-3.04zm-5.42-3.06c1.47.66 3.7 1.35 4.18 2.39.45 1.05.27 1.67.27 1.67H.04s-.19-.62.27-1.67c.46-1.05 2.68-1.75 4.16-2.4 1.48-.65 1.33-1.05 1.38-1.59 0-.07.01-.14.01-.21-.52-.45-.95-1.08-1.22-1.8l-.01-.01c0-.01-.01-.02-.01-.03-.07-.15-.12-.32-.16-.49-.34-.06-.54-.43-.62-.78-.08-.14-.24-.48-.2-.87.05-.51.26-.74.49-.83v-.08c0-.64.05-1.55.17-2.15a3.648 3.648 0 0 1 1.4-2.36C6.32 2.25 7.21 2 8 2s1.68.25 2.31.73a3.63 3.63 0 0 1 1.4 2.36c.11.6.17 1.52.17 2.15v.09c.22.09.42.32.47.82.03.39-.12.73-.2.87-.07.34-.27.71-.61.78-.04.16-.09.33-.15.48-.01.01-.02.05-.02.05-.27.71-.68 1.33-1.19 1.78 0 .08 0 .16.01.23.05.55-.15.95 1.33 1.6z"/></svg>
                <div className="filter-name">{resultRunnerIdToEmailMap[runnerId]}</div>
                <svg className="remove-filter svg-icon" onClick={() => Message.promise("removeResultFilter", {runnerId: runnerId})} viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 0 0-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 0 0-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 0 0 1.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 0 0 .71-1.71L11.41 10z"/></svg>
              </div>
            ))}
          </div>
        </div>
        {/*{false && (*/}
          {/*<div className="rf-testqualifier-panel">*/}
            {/*<Dropdown className={"quick-buttons"} button={*/}
              {/*<div title="Tags" data-tip='Test Tags'>*/}
                {/*<svg  className="svg-icon hoverable" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 5c.6 0 1-.4 1-1V2c0-.5-.4-1-1-1s-1 .5-1 1v2c0 .6.4 1 1 1zM5 5c.6 0 1-.4 1-1V2c0-.5-.4-1-1-1s-1 .5-1 1v2c0 .6.4 1 1 1zm13-2h-1v1c0 1.1-.9 2-2 2s-2-.9-2-2V3H7v1c0 1.1-.9 2-2 2s-2-.9-2-2V3H2c-.5 0-1 .5-1 1v14c0 .5.5 1 1 1h16c.5 0 1-.5 1-1V4c0-.5-.5-1-1-1zM7 17H3v-4h4v4zm0-5H3V8h4v4zm5 5H8v-4h4v4zm0-5H8V8h4v4zm5 5h-4v-4h4v4zm0-5h-4V8h4v4z" fill-rule="nonzero"/></svg>*/}
              {/*</div>*/}
            {/*}>*/}
              {/*<div onClick={(e) => e.stopPropagation()}>*/}
                {/*<div className="dd-header">Add Tag Filter</div>*/}
                {/*{tags.map((tag, idx) => (*/}
                  {/*<div key={idx} className="dd-item" onClick={() => onAddTagFilter(tag)}>*/}
                    {/*<svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>*/}
                    {/*{tag.name}*/}
                  {/*</div>*/}
                {/*))}*/}
              {/*</div>*/}
            {/*</Dropdown>*/}
            {/*<Dropdown className={"quick-buttons"} button={*/}
              {/*<div title="Tags" data-tip='Test Tags'>*/}
                {/*<svg className="svg-icon hoverable" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 9.59V4c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .28.11.53.29.71l3 3a1.003 1.003 0 0 0 1.42-1.42L11 9.59zM10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>*/}
              {/*</div>*/}
            {/*}>*/}
              {/*<div onClick={(e) => e.stopPropagation()}>*/}
                {/*<div className="dd-header">Add Tag Filter</div>*/}
                {/*{tags.map((tag, idx) => (*/}
                  {/*<div key={idx} className="dd-item" onClick={() => onAddTagFilter(tag)}>*/}
                    {/*<svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>*/}
                    {/*{tag.name}*/}
                  {/*</div>*/}
                {/*))}*/}
              {/*</div>*/}
            {/*</Dropdown>*/}
            {/*<Dropdown className={"quick-buttons"} button={*/}
              {/*<div title="Tags" data-tip='Test Tags'>*/}
                {/*<svg className="svg-icon hoverable" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10h-2c-.23 0-.42-.09-.59-.21l-.01.01-1.69-1.27-.63 3.14 2.62 2.62c.19.18.3.43.3.71v4c0 .55-.45 1-1 1s-1-.45-1-1v-3.59L9.39 12.8l-2.45 6.55h-.01c-.14.38-.5.65-.93.65-.55 0-1-.45-1-1 0-.12.03-.24.07-.35h-.01L9.43 7h-2.9l-1.7 2.55-.01-.01c-.18.27-.47.46-.82.46-.55 0-1-.45-1-1 0-.21.08-.39.18-.54l-.01-.01 2-3 .02.01C5.36 5.19 5.65 5 6 5h4.18l.36-.96c-.33-.43-.54-.96-.54-1.54a2.5 2.5 0 0 1 5 0A2.5 2.5 0 0 1 12.5 5c-.06 0-.12-.01-.18-.02l-.44 1.18L14.33 8H16c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>*/}
              {/*</div>*/}
            {/*}>*/}
              {/*<div onClick={(e) => e.stopPropagation()}>*/}
                {/*<div className="dd-header">Add Tag Filter</div>*/}
                {/*{tags.map((tag, idx) => (*/}
                  {/*<div key={idx} className="dd-item" onClick={() => onAddTagFilter(tag)}>*/}
                    {/*<svg className="svg-icon" viewBox="0 0 20 20"><path d="M2 4a2 2 0 0 1 2-2h4.588a2 2 0 0 1 1.414.586l7.41 7.41a2 2 0 0 1 0 2.828l-4.588 4.588a2 2 0 0 1-2.829 0l-7.41-7.41A2 2 0 0 1 2 8.588V4zm3.489-.006a1.495 1.495 0 1 0 0 2.99 1.495 1.495 0 0 0 0-2.99z" fill-rule="evenodd"/></svg>*/}
                    {/*{tag.name}*/}
                  {/*</div>*/}
                {/*))}*/}
              {/*</div>*/}
            {/*</Dropdown>*/}
          {/*</div>*/}
        {/*)}*/}
      </div>
    )
  }

  getRunsForFilter() {

    const { resultRunIdToNameMap } = this.props;

    var runs = [];

    for (var i in resultRunIdToNameMap) {
      runs.push({id: i, name: resultRunIdToNameMap[i]})
    };

    return runs.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

  }

  onAddFilter(filterType, filterEntity) {
    Message.promise("addResultFilter", {filterType, filterEntity})
  }

  onClear() {
    const { loadResults } = this.props;
    Message.promise("clearResultFilters").then(() => loadResults());
  }


}

export default ResultFilters;
