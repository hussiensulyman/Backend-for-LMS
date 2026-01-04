const videosService = require('../services/videosService');
const VideoRepo = require('../models/VideoRepo');

jest.mock('../models/VideoRepo');

test('addComment calls repo with correct args', async () => {
  VideoRepo.addComment.mockResolvedValue({ id: 1, content: 'ok' });
  const c = await videosService.addComment(5, 2, { timestamp: 12, content: 'ok' });
  expect(VideoRepo.addComment).toHaveBeenCalledWith(5, expect.objectContaining({ userId: 2, content: 'ok' }));
  expect(c).toHaveProperty('id', 1);
});