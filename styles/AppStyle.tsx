import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const Sidebar = styled.div`
  flex: 0.23;
  height: 100vh;
  padding: 1rem;
  overflow-y: scroll;
  border-right: 1px #6c6c6cee solid;
`;

export const ClockTimer = styled.div`
  display: flex;
  align-items: center;
  background-color: #eee0;
  padding: 0.5rem 0.5rem;
  border-radius: 10px;
  border: 1.4px dashed var(--border-color);
  color: #b2b2b2;
  h3 {
    margin-left: 0.5rem;
  }
`;

export const AnswersContainer = styled.div`
  margin-top: 0.5rem;
  border: 1.4px dashed var(--border-color);
  border-radius: 10px;
`;

export const SideTopBar = styled.div`
  padding: 0.3rem;
  display: flex;
  justify-content: center;
  background: #80808078;
  border-radius: 10px 10px 0 0;
  font-size: 0.8rem;
  p {
    margin-right: 1rem;
  }
  b {
    color: white;
    margin-left: 1px;
    border-radius: 5px;
  }
`;

export const SideCounts = styled.i`
  font-style: normal;
  margin: 0 2px;
  font-weight: bold;
  color: #fff;
  padding: 0 6px;
  border-radius: 5px;
`;

export const SideAnswer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem;
  border-top: 1px dashed var(--border-color);
  img {
    height: 20px;
    width: 20px;
    margin-right: 5px;
  }
  h4 {
    font-size: 0.85rem;
    font-weight: 300;
  }
  p {
    font-size: 0.8rem;
    color: gray;
  }
`;

export const Main = styled.div`
  flex: 0.77;
  padding: 1rem 3rem;
  height: 100%;
`;

export const CalcTimer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  h3 {
    margin-right: 0.4rem;
    font-weight: 400;
  }
`;

export const CalcForm = styled.form`
  display: flex;
  margin-top: 4rem;
  justify-content: center;
`;

export const CalcSum = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  border-bottom: 3px dashed var(--border-color);
  width: 20rem;
  h2 {
    position: absolute;
    bottom: 0;
    left: 0;
    color: var(--border-color);
    font-size: 3rem;
  }
  h1 {
    font-size: 4rem;
  }
`;

export const CalcAnswer = styled.input`
  margin: 1rem 0;
  width: 20rem;
  font-size: 4rem;
  font-weight: 700;
  font-family: var(--font-inter);
  text-align: center;
  padding: 0 1rem;
  outline: none;
  overflow-y: hidden;
  border-radius: 0.5rem;
  border: none;
`;
