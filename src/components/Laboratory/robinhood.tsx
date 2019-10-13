import React from 'react';
import { connect } from 'react-redux';

import RAccount from './robinhood-account.tsx';
import RobinhoodMain from './robinhood-main';
import ETFs from './robinhood-etfs.tsx';
import Stocks from './robinhood-stocks.tsx';
import Button from '../Common/Material-UI/button.tsx';
import twitter from '../../assets/images/twitter.png';

import {
  loginTest,
  logout,
  getOrders,
  getInstrument,
  getPositions,
  getQuotes,
  loadingData,
} from './robinhood-account-redux.tsx';

class Robinhood extends React.Component {
  componentDidMount() {
    console.log('didMount');
  }

  componentWillMount() {
    console.log('willMount');
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.authenticated &&
      prevProps.portfolio.length === 0 &&
      prevProps.positions === ''
    ) {
      try {
        const positions = await this.props.onPositions();

        let instruments = [];
        for (let i = 0; i < positions.payload.results.length; i++) {
          const response = await this.props.onInstrument(
            positions.payload.results[i].instrument
          );
          instruments.push(response);
        }

        let quotes = [];
        for (let i = 0; i < instruments.length; i++) {
          const response = await this.props.onQuotes(
            instruments[i].payload.results.symbol
          );
          quotes.push(response);
        }

        const loading = await this.props.onLoading();
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const tabs: string[] = ['Overview', 'ETFs', 'Regular Stocks'];
    const accountInfo = [];
    const {
      account,
      portfolio,
      positions,
      authenticated,
      instruments,
      orders,
      quotes,
      login,
      logout,
      onOrders,
      onInstrument,
      onPositions,
      loading,
    } = this.props;

    const combine = instruments.map((i) =>
      Object.assign(i, quotes.find((q) => q.symbol == i.symbol))
    );
    const stockInfo = combine.map((c, index) =>
      Object.assign(c, positions.find((p) => p.instrument == c.instrument))
    );

    const components: React.Component[] = [
      <RAccount
        authenticated={authenticated}
        account={account}
        portfolio={portfolio}
        stockInfo={stockInfo}
        onLogin={login}
        onLogout={logout}
        loading={loading}
      />,
      <ETFs />,
      <Stocks
        authenticated={authenticated}
        portfolio={portfolio}
        stockInfo={stockInfo}
        orders={orders}
      />,
    ];

    return (
      <div className='project-background robinhood'>
        {authenticated ? (
          <RobinhoodMain />
        ) : (
          <div className='robinhood-login-wrapper' onClick={login}>
            <img src={twitter} alt='twitter bird' />
            <div>Login</div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.robinhoodAccount.account,
  portfolio: state.robinhoodAccount.portfolio,
  authenticated: state.robinhoodAccount.logged_in,
  instruments: state.robinhoodAccount.instruments,
  orders: state.robinhoodAccount.orders,
  positions: state.robinhoodAccount.positions,
  quotes: state.robinhoodAccount.quotes,
  loading: state.robinhoodAccount.loading,
});

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(loginTest(token)),
  logout: () => dispatch(logout()),
  onOrders: () => dispatch(getOrders()),
  onInstrument: (url) => dispatch(getInstrument(url)),
  onPositions: () => dispatch(getPositions()),
  onQuotes: (symbol) => dispatch(getQuotes(symbol)),
  onLoading: () => dispatch(loadingData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Robinhood);
