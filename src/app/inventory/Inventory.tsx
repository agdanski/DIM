import React from 'react';
import { DestinyAccount } from '../accounts/destiny-account.service';
import { Loading } from '../dim-ui/Loading';
import Stores from './Stores';
import { D1StoresService } from './d1-stores.service';
import { D2StoresService } from './d2-stores.service';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import ClearNewItems from './ClearNewItems';
import StackableDragHelp from './StackableDragHelp';
import LoadoutDrawer from '../loadout/LoadoutDrawer';
import { Subscriptions } from '../rx-utils';
import { refresh$ } from '../shell/refresh';
import Compare from '../compare/Compare';
import D2Farming from '../farming/D2Farming';
import D1Farming from '../farming/D1Farming';
import InfusionFinder from '../infuse/InfusionFinder';
import { queueAction } from './action-queue';
import { StJudeToaster } from 'app/stJude/StJudeToaster';

const mobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);

interface Props {
  account: DestinyAccount;
  storesLoaded: boolean;
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    storesLoaded: state.inventory.stores.length > 0
  };
}

function getStoresService(account: DestinyAccount) {
  return account.destinyVersion === 1 ? D1StoresService : D2StoresService;
}

class Inventory extends React.Component<Props> {
  private subscriptions = new Subscriptions();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const storesService = getStoresService(this.props.account);

    // TODO: Dispatch an action to load stores
    storesService.getStoresStream(this.props.account);

    if (storesService.getStores().length && !this.props.storesLoaded) {
      // TODO: Don't really have to fully reload!
      queueAction(() => storesService.reloadStores());
    }

    this.subscriptions.add(
      refresh$.subscribe(() => queueAction(() => storesService.reloadStores()))
    );
  }

  componentWillUnmount() {
    this.subscriptions.unsubscribe();
  }

  render() {
    const { storesLoaded, account } = this.props;

    if (!storesLoaded) {
      return <Loading />;
    }

    return (
      <>
        <Stores />
        {!mobile && <StJudeToaster />}
        <LoadoutDrawer />
        <Compare />
        <StackableDragHelp />
        {account.destinyVersion === 1 ? <D1Farming /> : <D2Farming />}
        <InfusionFinder destinyVersion={account.destinyVersion} />
        <ClearNewItems account={account} />
      </>
    );
  }
}

export default connect(mapStateToProps)(Inventory);
