import React from 'react';
import { UIView } from '@uirouter/react';
import ManifestProgress from './ManifestProgress';
import { DestinyAccount } from '../accounts/destiny-account.service';
import ItemPopupContainer from '../item-popup/ItemPopupContainer';
import ItemPickerContainer from '../item-picker/ItemPickerContainer';
import MoveAmountPopupContainer from '../inventory/MoveAmountPopupContainer';
import { t } from 'app/i18next-t';
import GlobalHotkeys from '../hotkeys/GlobalHotkeys';
import { itemTags } from '../inventory/dim-item-info';
import { Hotkey } from '../hotkeys/hotkeys';

interface Props {
  account: DestinyAccount;
}

/**
 * Base view for pages that show Destiny content.
 */
export default class Destiny extends React.Component<Props> {
  render() {
    // Define some hotkeys without implementation, so they show up in the help
    const hotkeys: Hotkey[] = [
      {
        combo: 'i',
        description: t('Hotkey.ToggleDetails'),
        callback() {
          // Empty - this gets redefined in dimMoveItemProperties
        }
      }
    ];

    itemTags.forEach((tag) => {
      if (tag.hotkey) {
        hotkeys.push({
          combo: tag.hotkey,
          description: t('Hotkey.MarkItemAs', {
            tag: t(tag.label)
          }),
          callback() {
            // Empty - this gets redefined in item-tag.component.ts
          }
        });
      }
    });

    return (
      <>
        <div className="store-bounds" />
        <div id="content">
          <UIView />
        </div>
        <GlobalHotkeys hotkeys={hotkeys} />
        <ItemPopupContainer boundarySelector=".store-bounds" />
        <ItemPickerContainer />
        <MoveAmountPopupContainer />
        <ManifestProgress destinyVersion={this.props.account.destinyVersion} />
      </>
    );
  }
}
