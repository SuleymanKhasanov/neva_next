import styles from './ContentBox.module.css';

const ContentBox = ({ children }: { children: React.ReactNode }) => {
  return <main className={styles.content}>{children}</main>;
};

export default ContentBox;
