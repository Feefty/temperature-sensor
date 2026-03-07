class GetHistory {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getHistory();
  }
}

module.exports = GetHistory;