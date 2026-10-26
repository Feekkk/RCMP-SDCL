import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

export default function FundCategoryGrid({ categories }) {
  return (
    <div className="fund-list">
      {categories.map((category, index) => (
        <Reveal as="div" className="fund-row" key={category.title}>
          <span className="fund-row-index">{String(index + 1).padStart(2, '0')}</span>

          <div className="fund-row-icon">
            <Icon name={category.icon} />
          </div>

          <div className="fund-row-body">
            <div className="fund-row-heading">
              <h3>{category.title}</h3>
              <span className="fund-row-amount">{category.amount}</span>
            </div>

            <p className="fund-summary">{category.summary}</p>

            <div className="fund-row-footer">
              <span className="fund-doc-label">Documents</span>
              <span className="fund-doc-value">{category.documents}</span>
            </div>

            {category.note && (
              <div className="fund-note">
                <Icon name="info" />
                <span>{category.note}</span>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
