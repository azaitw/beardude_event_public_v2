
const LeaderBoard = (props) => <div>
  <style jsx>{`
    .raceSelector {
      justify-content: center;
      display: flex;
      flex-wrap: wrap;
      margin: 5px 0 0 0;
    }
    .raceSelector .li,
    .raceSelector .selected {
      position: relative;
      color: #fff;
      height: 28px;
      line-height: 28px;
      text-align: left;
      margin: 0;
      border-radius: 3px 3px 0 0;
      border: 1px solid transparent;
    }
    .raceSelector .selected {
      background: #aaa;
      border: 1px solid #555;
    }
    .raceSelector .li button,
    .raceSelector .selected button {
      position: relative;
      margin: 0;
      padding: 0 8px;
      border: 0;
      font-size: 13px;
      text-indent: 0;
    }
    .init {
      display: inline-block;
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0);
      border-radius: 3px 3px 0 0;
    }
    .started {
      composes: init;
      animation-name: pulse;
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
      background: rgba(43, 171, 2, 0.7);
    }
    .ended {
      composes: init;
      background: rgba(165,124,9, 0.7);
    }
    .submitted {
      composes: init;
      background: rgba(37,99,17, 0.7);
    }
    .list {
      display: block;
      height: 100%;
      width: 100%;
      text-align: left;
      text-decoration: none;
      color: #fff;
      margin: 0 0 0 10px;
      padding: 0 40px 0 0;
      text-indent: 5px;
      border: 0;
      background: 0;
      border-bottom: 1px solid #ddd;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      outline: none;
      position: relative;
      letter-spacing: 0.5px;
    }
    .listFt {
      position: absolute;
      bottom: 121px;
      background: rgba(66,66,66,0.2);
      width: 99.5%;
      height: 36px;
    }
    .managerList {
      position: relative;
      display: flex;
      flex-direction: row;
      padding: 0;
      color: #fff;
      font-size: 14px;
      border-top: 1px solid #555;
    }
    .managerList > div {
      position: relative;
      font-size: 0;
      vertical-align: top;
    }
    .dashId {
      border-bottom: 1px solid #555;
    }
    .dashTable thead {
      background: #333
    }
    .dashTable th,
    .dashTable td {
      padding: 0 10px;
      height: 32px;
      border-left: 0;
      border-right: 1px solid #555;
      min-width: 50px;
      font-size: 13px;
      position: relative;
    }
    .dashTable th {
      height: 31px;
      white-space: nowrap;
      border-bottom: 1px solid #555;
      text-align: center;
    }
    .dashTable tbody tr:first-child {
      height: 33px;
    }
    .dashTable tbody tr {
      background: 0;
      height: auto;
      line-height: 0;
    }
    .dashTable .no {
      text-align: center;
      background: #333;
    }
    .dashTable .name {
      white-space: nowrap;
    }
    .dashTable .lap {
      font-size: 13px;
      text-align: center;
      color: #fff;
      font-family: Garamond, Times;
      padding: 0 6px;
    }
    .dashItem {
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #555;
    }
    .dashTable .name {
      white-space: nowrap;
    }
    .dashTable .lap {
      font-size: 13px;
      text-align: center;
      color: #fff;
      font-family: Garamond, Times;
      padding: 0 6px;
    }
    .raceNumber {
      margin: 0 5px 0 0;
    }
    .scrollBox {
      overflow-x: scroll;
      overflow: auto;
      border-bottom: 1px solid #555;
      flex-grow: 1;
    }
    .scrollBox table {
      width: 100%;
    }
    .summary {
      border-bottom: 1px solid #555;
      background: #191919;
    }
    .summary .lap {
      padding: 0 10px;
      text-align: center;
    }
    .advTable {
      border-bottom: 1px solid #555;
      background: #191919;
    }
    .center {
      text-align: center;
    }
    .footer {
      padding: 30px 0;
      color: #fff;
      font-size: 11px;
      text-align :center;
    }
  `}</style>
  <ul className='raceSelector'>
    {props.races.map((item, index) => <li className={(index === props.raceSelected) ? 'selected' : 'li'} key={'race' + item.id}>
      <div className={item.raceStatus} />
      <button className='list' onClick={props.handleSelect(index)}>
        {props.nameTables.group && <span>{props.nameTables.group[item.group.toString()]} -</span>}
        <span>{(item.nameCht) ? item.nameCht : item.name}</span>
      </button>
    </li>)}
  </ul>
  {(!props.race || props.race.registrationIds.length === 0)
  ? <div className='noData'>尚無比賽資料</div>
  : <div className='managerList'>
    <div className='dashId'>
      <table className='dashTable'>
        <thead><tr><th className='no'>排位</th><th className='name'>選手</th></tr></thead>
        <tbody>{props.race.result.map((record, index) => {
          const obj = props.nameTables.reg[record.registration]
          return obj ? <tr className='dashItem' key={'rec' + index}>
            <td className='no'>{index + 1}</td>
            <td className='name'><span className='raceNumber'>{obj.raceNumber}</span> <span>{obj.name}</span></td>
          </tr> : <tr />
        })}
        </tbody>
      </table>
    </div>
    <div className='scrollBox'>
      <table className='dashTable'>
        <thead><tr>
          {props.race.result[0] && props.race.result[0].lapRecords.map((V, I) => <th key={'th-' + I}>{I + 1}</th>)}
        </tr></thead>
        <tbody>{props.race.result.length > 0 && props.race.result.map((record, index) => <tr key={'tr-rec-' + record.registration} className='dashItem'>
          {record.lapRecords.map((time, index) => <td key={'record-' + index} className='lap'>{time}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <div className='summary'>
      <table className='dashTable'>
        <thead><tr><th>加總</th></tr></thead>
        <tbody>{props.race.result && props.race.result.map((record, index) => <tr className='dashItem' key={'lap' + index}><td className='lap'>{record.sum}</td></tr>)}
        </tbody>
      </table>
    </div>
    <div className='advTable'>
      <table className='dashTable'>
        <thead><tr><th><span>{props.race.isFinalRace ? '總排名' : '晉級'}</span></th></tr></thead>
        <tbody>{props.race.result.map((record, index) => <tr key={'adv' + index} className='dashItem'><td className='center'>{props.race.isFinalRace ? index + 1 : props.nameTables.race[record.advanceTo]}</td></tr>)}</tbody>
      </table>
    </div>
  </div>}
</div>

LeaderBoard.getInitialProps = function (props) {
  let out = {
    nameTables: props.nameTables,
    groups: props.groups,
    race: props.races[props.raceSelected],
    races: props.races,
    raceSelected: props.raceSelected,
    handleSelect: props.handleSelect
  }
  return out
}

export default LeaderBoard
