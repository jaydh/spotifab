import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Header from './index';

describe('Header', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  })

  it('Header should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it('Header should render both TrackSearch and UserDetails', () => {
    const w= shallow(<Header />);
    expect(w.children()).to.have.length(2);
  });

});
