const TestUtil = require('../utils/TestUtils')

const testUtil = new TestUtil()
const chalk = require('chalk')
const expect = require('chai').expect

class OverviewPage {
  /**
   * Overview page loaded after user loggedIn.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async HasOverviewPageLoaded(page) {
    try {
      await page.waitForSelector('#burger_icon_menu', {
        visible: true,
        timeout: 120000
      })
    } catch (e) {
      await testUtil.takeScreenshot(page, 'overview-page-loading-issue')
      expect(e, 'Hamburger icon loading issue').equals(null)
    }
  }

  /**
   * Select Network from overview page
   * @param page
   * @param network - Network type default: testnet
   * @returns {Promise<void>}
   * @constructor
   * @example - SelectNetwork(page,'testnet')
   */
  async SelectNetwork(page, network = 'testnet') {
    await page.waitForSelector('#head_network', { visible: true })
    await page.click('#head_network', { delay: 5 })
    await page.waitForTimeout(1000)
    switch (network) {
      case 'testnet': {
        await page.waitForSelector('#testnet_network', { visible: true })
        console.log('user successfully logged in after import wallet')
        await page.click('#testnet_network', { delay: 10 })
        await page.waitForTimeout(2000)
        await page.waitForSelector('#active_network', { visible: true })
        const overviewText = await page.$eval('#active_network', el => el.innerText)
        expect(overviewText, 'Testnet overview header').contain('TESTNET')
        console.log('user successfully changed to TESTNET')
        break
      }

      case 'mainnet': {
        await page.waitForSelector('#mainnet_network', { visible: true })
        console.log('user successfully logged in after import wallet')
        await page.click('#mainnet_network')
        await page.waitForSelector('#active_network', { visible: true })
        const overviewText = await page.$eval('#active_network', el => el.innerText)
        expect(overviewText, 'Mainnet overview header').contain('MAINNET')
        console.log('user successfully changed to MAINNET')
        break
      }

      default:
        throw Error(`Unsupported Network: ${network}`)
    }
  }

  /**
   * Check Send,swipe and receive options have been displayed.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async CloseWatsNewModal(page) {
    await page.waitForSelector('#wats_new_close_btn', {
      visible: true,
      timeout: 60000
    })
    await page.click('#wats_new_close_btn')
    console.log('Wat\'s new Modal closed')
  }

  /**
   * Check Send,swipe and receive options have been displayed.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ValidateSendSwipeReceiveOptions(page) {
    // check Send & Swap & Receive options have been displayed
    try {
      await page.waitForSelector('#send_action', { visible: true, timeout: 180000 })
    } catch (e) {
      const ts = Math.round((new Date()).getTime() / 1000)
      await page.screenshot({ path: `screenshots/overview-page-loading-issue-${ts}.png` })
      expect(e, 'Overview page still Loading.....didn\'t load send/receive/swap option').equals(null)
    }

    await page.waitForSelector('#send_action', {
      visible: true,
      timeout: 60000
    })
    console.log('SEND button has been displayed')
    await page.waitForSelector('#swap_action', {
      visible: true,
      timeout: 60000
    })
    console.log('SWAP button has been displayed')
    await page.waitForSelector('#receive_action', {
      visible: true,
      timeout: 60000
    })
    console.log('RECEIVE button has been displayed')
  }

  /**
   * Click on Chain
   * @param page
   * @param chain - chain name
   * @returns {Promise<void>}
   * @constructor
   * @example SelectChain(page,'BITCOIN')
   */
  async SelectChain(page, chain) {
    await page.waitForSelector('.wallet-tab-content', { visible: true })
    switch (chain) {
      case 'BTC': {
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        break
      }

      case 'DAI':
      case 'ETH': {
        const eth = await page.waitForSelector('#ETHEREUM', { visible: true })
        await eth.click()
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        break
      }

      case 'BNB': {
        const eth = await page.waitForSelector('#BSC', { visible: true })
        await eth.click()
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        break
      }

      case 'NEAR': {
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        const eth = await page.waitForSelector('#NEAR', { visible: true })
        await eth.click()
        break
      }

      case 'ARBETH': {
        const eth = await page.waitForSelector('#ARBITRUM', { visible: true })
        await eth.click()
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        break
      }

      case 'SOV':
      case 'RBTC': {
        const eth = await page.waitForSelector('#RSK', { visible: true })
        await eth.click()
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        break
      }

      case 'MATIC':
      case 'PWETH': {
        const eth = await page.waitForSelector('#POLYGON', { visible: true })
        await eth.click()
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        break
      }
      case 'SOL': {
        const eth = await page.waitForSelector('#SOLANA', { visible: true })
        await eth.click()
        await page.waitForSelector(`#${chain}`, { visible: true })
        // check assert value
        await page.waitForSelector('.list-item-detail', { visible: true })
        // check assert fiat value
        await page.waitForSelector('.list-item-detail-sub', { visible: true })
        await page.click(`#${chain}`)
        break
      }

      case 'LUNA': {
        await page.waitForSelector(`#${chain}`, { visible: true })
        await page.click(`#${chain}`)
        const terra = await page.waitForSelector('#TERRA', { visible: true })
        await terra.click()
        break
      }

      default:
        throw Error(`Unsupported chain: ${chain}`)
    }
    await page.waitForSelector('.account-container_balance_code', { visible: true })
    await page.waitForSelector('#refresh-icon', { visible: true })
  }

  /**
   * Validate view explorer href for each assert on overview page.
   * @param page
   * @param asset {string} - assert symbol.
   * @returns {Promise<void>}
   * @constructor
   */
  async HasViewExplorerDisplayed(page, asset) {
    const id = `#${asset}_view_in_explorer`
    await page.waitForSelector(id, { visible: true })
    const explorerLink = await page.$eval(id, el => el.href)
    expect(explorerLink).contains('https://')
    console.log('View explorer link:' + explorerLink)
  }

  /**
   * Click Receive button.
   * @param page
   * @param chainCode - chainCode
   * @returns {Promise<void>}
   * @constructor
   * @example SelectChain(page,'BTC')
   */
  async ClickChainReceive(page, chainCode) {
    await page.waitForSelector('.account-container_balance_code', { visible: true })
    const code = await page.$eval('.account-container_balance_code', el => el.textContent)
    expect(code).equals(chainCode)
    // Click Receive button
    await page.click(`#${chainCode}_receive_button`)
    console.log(chalk.green('User clicked on receive option for ' + chainCode))
    await page.waitForSelector('.receive_address', { visible: true })
  }

  /**
   * Check asset account details overview
   * @param page
   * @param assertCode
   * @returns {Promise<void>}
   * @constructor
   */
  async CheckAssertOverviewDetails(page, assertCode) {
    await page.waitForSelector('.account-container_balance_code', { visible: true })
    const code = await page.$eval('.account-container_balance_code', el => el.textContent)
    expect(code, 'Assert Code wrong').equals(assertCode)
    // Check assert account title
    const title = await page.$eval('.account-title', el => el.textContent)
    expect(title).contains(assertCode)
    // Check fiat balance not NaN
    expect(await page.$eval('.account-container_balance_fiat', el => el.textContent), 'Balance $ not be NaN')
      .not.equals('NaN')
    // account balance is not NaN
    expect(await page.$eval('.account-container_balance_value', el => el.textContent), 'Balance value not be NaN')
      .not.equals('NaN')
  }

  /**
   * Validate total asserts from overview page.
   * @param page
   * @returns {Promise<*>}
   * @constructor
   */
  async ValidateTotalAssets(page, newWallet = true) {
    const assets = newWallet ? 7 : 8
    await page.waitForSelector('#total_assets', { timeout: 60000 })
    const assetsCount = await page.$eval('#total_assets', (el) => el.textContent)
    expect(assetsCount, `Total assets should be ${assets} on overview page`).contain(`${assets} Assets`)
  }

  /**
   * Get Total Liquidity from wallet.
   * @param page
   * @returns {Promise<*>}
   * @constructor
   */
  async GetTotalLiquidity(page) {
    // Check the Total amount - 10s wait to load amount
    await page.waitForSelector('.wallet-stats_total', { timeout: 60000 })
    await page.waitForTimeout(10000)
    return await page.$eval('.wallet-stats_total', el => (el.innerText).replace(/[.,\s]/g, ''))
  }

  /**
   * Get Currency from overview.
   * @param page
   * @returns {Promise<*>}
   * @constructor
   */
  async GetCurrency(page) {
    return await page.$eval('.wallet-stats', el => el.innerText)
  }

  /**
   * Click SEND option from Overview page.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ClickSend(page) {
    try {
      await page.waitForSelector('#send_action', { visible: true, timeout: 180000 })
    } catch (e) {
      const ts = Math.round((new Date()).getTime() / 1000)
      await page.screenshot({ path: `screenshots/send-button-not-loaded-${ts}.png` })
      expect(e, 'Send button not loaded....').equals(null)
    }

    await page.click('#send_action')
  }

  /**
   * Click on SWIPE button from overview.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ClickSwipe(page) {
    await page.waitForSelector('#swap_action', { visible: true })
    await page.click('#swap_action')
    console.log('User clicked on SWAP button from overview page')
    await page.waitForSelector('#search_for_a_currency_search', { visible: true })
  }

  /**
   * Click on Lock option.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ClickLock(page) {
    // Lock
    await page.waitForSelector('#burger_icon_menu', { visible: true })
    await page.click('#burger_icon_menu')
    await page.waitForSelector('#lock', { visible: true })
    await page.click('#lock')
    console.log(chalk.green('User clicked on lock option'))
    await page.waitForSelector('#password', { visible: true })
  }

  /**
   * Get Assert address from overview page
   * @param page
   * @param assertName - ETHEREUM, BITCOIN
   * @returns {Promise<void>}
   * @constructor
   */
  async GetAssertAddress(page, assertName) {
    const $parent = await page.$(`#${assertName}`)
    const assertAddress = await $parent.$eval('#assert_address', (el) => el.textContent.trim())
    expect(assertAddress).not.equals(null)
    return assertAddress
  }

  /**
   * Click on Hamburger icon.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ClickOnBurgerIcon(page) {
    // Click on Backup seed from Burger Icon menu
    await page.waitForSelector('#burger_icon_menu', { visible: true })
    await page.click('#burger_icon_menu')
    console.log(chalk.green('User clicked on Burger Icon Menu'))
  }

  /**
   * Click on Settings under menu items.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async SelectSettings(page) {
    const settings = await page.waitForSelector('#settings', { visible: true })
    await settings.click()
    await page.waitForSelector('#settings_item_default_wallet', { visible: true })
  }

  /**
   * Click on Add Custom token from setting screen.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ClickAddCustomToken(page) {
    await this.ClickOnBurgerIcon(page)
    // Click Manage Assets
    await page.waitForSelector('#manage_assets', { visible: true })
    await page.click('#manage_assets')
    console.log(chalk.green('User clicked on Manage Assets'))
    // click on add custom token
    await page.waitForSelector('#add_custom_token', { visible: true })
    await page.click('#add_custom_token')
    console.log(chalk.green('User clicked on Add Custom Token'))
  }

  /**
   * Click on Manage Accounts from Overview page.
   * @param page
   * @returns {Promise<void>}
   * @constructor
   */
  async ClickOnManageAccounts(page) {
    await page.waitForSelector('#burger_icon_menu', { visible: true })
    await page.click('#burger_icon_menu')
    console.log(chalk.green('User clicked on Burger Icon Menu'))
    // Click Manage Accounts
    await page.waitForSelector('#manage_accounts', { visible: true })
    await page.click('#manage_accounts')
    console.log(chalk.green('User clicked on Manage Accounts'))
    await page.waitForSelector('#create-account-plus-icon-bitcoin', { visible: true })
  }
}

module.exports = OverviewPage
