import React from 'react';

import { Button, Dropdown, Popup } from 'semantic-ui-react';

import DirtyingComponent from '../dirtying_component.js';

import './session_tabbed_container.css';

/**
 * A tabbed display for a session track.  That is, a display where each tab has
 * persistable complex state.  Part of an evolving descendant of the grokysis
 * session notebook concept.  Previously the react components processed slot
 * messages directly and therefore needed to be instantiated at all times, but
 * that model-view coupling (for simplicity) is no longer justifiable when
 * things aren't always visible and may be very expensive (graph updates!).
 *
 * Expected props:
 * - grokCtx
 * - trackName
 */
export class SessionTabbedToolbar extends DirtyingComponent {
  constructor(props) {
    // the notebook is characterized by the track.  The function is only invoked
    // after the constructor completes, so it's okay to access our convenience
    // variable initialized below.
    super(props, function () { return this.track; });

    this.sessionManager = this.props.grokCtx.sessionManager;
    this.track = this.sessionManager.tracks[this.props.trackName];
  }

  render() {
    const useActiveThing = this.track.computeTabbedThingToDisplay();

    const makeTabButtons = (track, activeThing) => {
      return track.things.map((thing) => {
        const selectThisThing = () => {
          track.selectThing(thing, 'click');
        };
        return (
          <Popup
          key={ thing.id }
          content={ thing.makeLabel() }
          mouseEnterDelay={250}
          position='right center'
          on='hover'
          size='large'
          trigger={
            <Button
            icon={ thing.binding.icon }
            active={ thing === activeThing }
            onClick={ selectThisThing }
            />
          }
          />
        );
      });
    };

    const tabButtons =
      makeTabButtons(this.track, useActiveThing);

    let maybeSpawnButton;
    if (this.props.spawn) {
      const addDropdownItems = this.sessionManager.userSpawnables.map(
        ({ type, binding }) => {
          const spawnThisTab = () => {
            this.track.addThing(
              null, null,
              {
                position: 'start',
                type,
                persisted: {}
              });
            };
            return (
              <Dropdown.Item
              key={ type }
              text={ binding.spawnable }
              onClick={ spawnThisTab }
              />
            );
          });

      maybeSpawnButton = (
        <Popup
          content='Add New Tab'
          position='right center'
          mouseEnterDelay={250}
          on='hover'
          size='large'
          trigger={
            <Dropdown
              trigger={<Button style={{ 'margin-right': 0 }} icon='plus' />}
              icon={ null }
              >
              <Dropdown.Menu>
                { addDropdownItems }
              </Dropdown.Menu>
            </Dropdown>
          }
          />
      );
    }

    const makeCloseButton = (track, activeThing, label) => {
      const closeCurrentThing = () => {
        if (activeThing) {
          activeThing.removeSelf();
        }
      };

      let canClose = activeThing &&
                      !activeThing.binding.permanent &&
                      track.things.length > 1;

      return (
        <Popup
            content={ canClose ? label : 'Current tab not allowed to be closed.' }
            position='right center'
            mouseEnterDelay={250}
            on='hover'
            size='large'
            trigger={
              <Dropdown
                trigger={<Button style={{ 'margin-right': 0 }} icon='close' />}
                direction='right'
                disabled={ !canClose }
                icon={ null }
                >
                <Dropdown.Menu>
                  <Dropdown.Item
                    key='close'
                    text='Yes, Close The Tab'
                    onClick={ closeCurrentThing }
                    />
                </Dropdown.Menu>
              </Dropdown>
            }
            />
        );
    };

    const closeButton = makeCloseButton(
      this.track, useActiveThing, this.props.closeLabel);

    // The Dropdown popups below for the add tab/close tab don't use
    // <Dropdown button> and instead wrap a Button explicitly via trigger
    // because otherwise they get styled like there's going to be some kind
    // of attached label to the right.  I didn't spend a lot of time on this
    // and mainly was cargo culting an example that already had the right
    // styling.  They also don't do the right thing in a Button.Group because of
    // this, so they end up as independent button things.
    //
    //
    return (
      <div className="sessionTabbedToolbar">
        <Button.Group vertical>
          { tabButtons }
        </Button.Group>
        &nbsp;
        { maybeSpawnButton }
        { closeButton }
      </div>
    );
  }
}

export class SessionTabbedContainer extends DirtyingComponent {
  constructor(props) {
    // the notebook is characterized by the track.  The function is only invoked
    // after the constructor completes, so it's okay to access our convenience
    // variable initialized below.
    super(props, function () { return this.track; });

    this.sessionManager = this.props.grokCtx.sessionManager;
    this.track = this.sessionManager.tracks[this.props.trackName];
  }

  render() {
    const activeThing = this.track.computeTabbedThingToDisplay();
    const activeWidget = activeThing && activeThing.makeWidget();

    let inactiveWidget = null;
    const inactiveThing = this.track.computeTabbedOccludedThing();
    if (inactiveThing) {
      inactiveWidget = inactiveThing.makeWidget();
    }

    let className = '';
    // This is set to true for the top context box where we want it to clip its
    // contents.  But we need to set it to false for the content box which is
    // inside the #scrolling div which wants to scroll and be the closest
    // stacking context.
    if (this.props.selfClip) {
      className = 'sessionTabbedContainer_tabs';
    }

    return (
      <div className={ className }>
          { activeWidget }
          { inactiveWidget }
      </div>
    );
  }
}